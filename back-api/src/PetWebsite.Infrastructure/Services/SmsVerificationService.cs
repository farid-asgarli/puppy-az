using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using PetWebsite.Application.Common.Handlers;
using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;
using PetWebsite.Domain.Constants;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Services;

/// <summary>
/// Service for managing SMS verification codes.
/// </summary>
public class SmsVerificationService(IApplicationDbContext dbContext, ISmsService smsService, IStringLocalizer localizer)
	: BaseHandler(localizer),
		ISmsVerificationService
{
	private readonly IApplicationDbContext _dbContext = dbContext;
	private readonly ISmsService _smsService = smsService;
	private const int EXPIRY_MINUTES = 10;
	private const int RATE_LIMIT_MINUTES = 2;
	private const int DAILY_SEND_LIMIT = 5;
	private const int MAX_VERIFY_ATTEMPTS = 5;
	private const int CLEANUP_HOURS = 24;

	public async Task<Result> SendVerificationCodeAsync(string phoneNumber, string purpose, CancellationToken cancellationToken = default)
	{
		try
		{
			// Clean up expired or old verified codes for this phone number
			await CleanupOldCodesAsync(phoneNumber, null, cancellationToken);

			// Check if there's a recent unverified code for this phone number
			var existingCode = await _dbContext
				.SmsVerificationCodes.Where(x =>
					x.PhoneNumber == phoneNumber && !x.IsVerified && x.ExpiresAt > DateTime.UtcNow && x.Purpose == purpose
				)
				.OrderByDescending(x => x.CreatedAt)
				.FirstOrDefaultAsync(cancellationToken);

			// If a valid code exists and was sent less than 2 minutes ago, prevent spam
			if (existingCode != null && existingCode.CreatedAt > DateTime.UtcNow.AddMinutes(-RATE_LIMIT_MINUTES))
			{
				return Result.Failure(L(LocalizationKeys.Sms.TooManyRequests), 429);
			}

			// Enforce daily send limit per phone number to prevent harassment
			var sentTodayCount = await _dbContext.SmsVerificationCodes.CountAsync(
				x => x.PhoneNumber == phoneNumber && x.CreatedAt > DateTime.UtcNow.AddHours(-24),
				cancellationToken
			);

			if (sentTodayCount >= DAILY_SEND_LIMIT)
			{
				return Result.Failure(L(LocalizationKeys.Sms.TooManyRequests), 429);
			}

			// Generate random 6-digit verification code
			var code = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

			// Create verification code record
			var verificationCode = new SmsVerificationCode
			{
				PhoneNumber = phoneNumber,
				Code = code,
				CreatedAt = DateTime.UtcNow,
				ExpiresAt = DateTime.UtcNow.AddMinutes(EXPIRY_MINUTES),
				Purpose = purpose,
			};

			await _dbContext.SmsVerificationCodes.AddAsync(verificationCode, cancellationToken);
			await _dbContext.SaveChangesAsync(cancellationToken);

			// Send SMS with verification code
			try
			{
				var smsMessage = L(LocalizationKeys.Sms.VerificationCodeMessage, code, EXPIRY_MINUTES);
				var smsOptions = new SendSmsOptions { Msisdn = phoneNumber, Body = smsMessage };

				await _smsService.SendSmsAsync(smsOptions, cancellationToken);
			}
			catch (Exception smsEx)
			{
				// SMS failed - delete the verification code
				_dbContext.SmsVerificationCodes.Remove(verificationCode);
				await _dbContext.SaveChangesAsync(cancellationToken);

				return Result.Failure($"{L(LocalizationKeys.Sms.SendFailed)}: {smsEx.Message}", 400);
			}

			return Result.Success();
		}
		catch (Exception ex)
		{
			return Result.Failure($"{L(LocalizationKeys.Sms.SendFailed)}: {ex.Message}", 500);
		}
	}

	public async Task<Result> VerifyCodeAsync(
		string phoneNumber,
		string code,
		string purpose,
		bool markAsUsed = true,
		CancellationToken cancellationToken = default
	)
	{
		try
		{
			// Fetch by phone+purpose only — do NOT filter by code here, so we can track failed attempts
			var verificationCode = await _dbContext
				.SmsVerificationCodes.Where(x => x.PhoneNumber == phoneNumber && x.Purpose == purpose && !x.IsVerified)
				.OrderByDescending(x => x.CreatedAt)
				.FirstOrDefaultAsync(cancellationToken);

			if (verificationCode == null)
			{
				return Result.Failure(L(LocalizationKeys.Sms.VerificationCodeNotFound), 400);
			}

			if (verificationCode.ExpiresAt < DateTime.UtcNow)
			{
				return Result.Failure(L(LocalizationKeys.Sms.VerificationCodeExpired), 400);
			}

			if (verificationCode.AttemptCount >= MAX_VERIFY_ATTEMPTS)
			{
				return Result.Failure(L(LocalizationKeys.Sms.VerificationCodeNotFound), 400);
			}

			if (verificationCode.Code != code)
			{
				verificationCode.AttemptCount++;
				await _dbContext.SaveChangesAsync(cancellationToken);
				return Result.Failure(L(LocalizationKeys.Sms.VerificationCodeNotFound), 400);
			}

			// Mark verification code as used if requested
			if (markAsUsed)
			{
				verificationCode.IsVerified = true;
				verificationCode.VerifiedAt = DateTime.UtcNow;
				await _dbContext.SaveChangesAsync(cancellationToken);
			}

			return Result.Success();
		}
		catch (Exception ex)
		{
			return Result.Failure($"{L(LocalizationKeys.Sms.VerificationFailed)}: {ex.Message}", 500);
		}
	}

	public async Task CleanupOldCodesAsync(string phoneNumber, int? excludeId = null, CancellationToken cancellationToken = default)
	{
		var query = _dbContext.SmsVerificationCodes.Where(x =>
			x.PhoneNumber == phoneNumber
			&& (x.ExpiresAt < DateTime.UtcNow || (x.IsVerified && x.VerifiedAt < DateTime.UtcNow.AddHours(-CLEANUP_HOURS)))
		);

		if (excludeId.HasValue)
		{
			query = query.Where(x => x.Id != excludeId.Value);
		}

		var oldCodes = await query.ToListAsync(cancellationToken);

		if (oldCodes.Count != 0)
		{
			_dbContext.SmsVerificationCodes.RemoveRange(oldCodes);
			await _dbContext.SaveChangesAsync(cancellationToken);
		}
	}
}

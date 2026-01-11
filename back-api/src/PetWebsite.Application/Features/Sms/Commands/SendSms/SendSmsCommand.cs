using PetWebsite.Application.Common.Interfaces;
using PetWebsite.Application.Common.Models;

namespace PetWebsite.Application.Features.Sms.Commands.SendSms;

/// <summary>
/// Command to send an SMS message.
/// </summary>
public record SendSmsCommand(string PhoneNumber, string Message) : ICommand<Result>;

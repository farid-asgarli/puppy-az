namespace PetWebsite.Application.Common.Interfaces;

public interface ITelegramService
{
    Task SendNewAdNotificationAsync(int adId, string title, string? category, string? breed, decimal? price, string city, string? phoneNumber, CancellationToken ct = default);
}

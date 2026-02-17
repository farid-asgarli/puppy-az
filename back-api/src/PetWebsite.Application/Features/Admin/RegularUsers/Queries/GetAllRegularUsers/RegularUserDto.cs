namespace PetWebsite.Application.Features.Admin.RegularUsers.Queries.GetAllRegularUsers;

/// <summary>
/// DTO representing a regular user for admin panel.
/// </summary>
public class RegularUserDto
{
    public Guid Id { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public bool IsActive { get; set; }
    public bool IsCreatedByAdmin { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public int TotalAds { get; set; }
    public int ActiveAds { get; set; }
}

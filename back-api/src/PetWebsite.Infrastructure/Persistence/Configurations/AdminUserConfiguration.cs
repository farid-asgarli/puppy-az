using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PetWebsite.Domain.Entities;

namespace PetWebsite.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity type configuration for AdminUser.
/// </summary>
public class AdminUserConfiguration : IEntityTypeConfiguration<AdminUser>
{
    public void Configure(EntityTypeBuilder<AdminUser> builder)
    {
        builder.Property(e => e.FirstName).IsRequired().HasMaxLength(100);

        builder.Property(e => e.LastName).IsRequired().HasMaxLength(100);

        builder.Property(e => e.RefreshToken).HasMaxLength(500);

        builder.Property(e => e.IsActive).HasDefaultValue(true);

        builder.Property(e => e.CreatedAt).IsRequired();
    }
}

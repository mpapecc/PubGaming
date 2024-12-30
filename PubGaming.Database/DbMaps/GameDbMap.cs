using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PubGaming.Database.Entites;

namespace PubGaming.Database.DbMaps;

public class GameDbMap : IEntityTypeConfiguration<Game>
{
    public void Configure(EntityTypeBuilder<Game> builder)
    {
        builder
            .Navigation(e => e.Sets)
            .AutoInclude();

        builder
            .HasMany(e => e.Sets)
            .WithOne(e => e.Game)
            .HasForeignKey(e => e.GameId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}


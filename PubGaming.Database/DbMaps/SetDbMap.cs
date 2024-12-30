using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PubGaming.Database.Entites;

namespace PubGaming.Database.DbMaps
{
    public class SetDbMap : IEntityTypeConfiguration<Set>
    {
        public void Configure(EntityTypeBuilder<Set> builder)
        {
            builder
                .Navigation(x => x.Questions)
                .AutoInclude();

            builder
                .HasMany(x => x.Questions)
                .WithOne(x => x.Set)
                .HasForeignKey(x => x.SetId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

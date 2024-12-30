using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PubGaming.Database.Entites;

namespace PubGaming.Database.DbMaps
{
    public class QuestionDbMap : IEntityTypeConfiguration<Question>
    {
        public void Configure(EntityTypeBuilder<Question> builder)
        {
            builder.OwnsMany(q => q.Answers, builder => { builder.ToJson(); });
        }
    }
}

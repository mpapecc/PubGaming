using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PubGaming.Domain.Entites;

namespace PubGaming.Persistance.Configuration
{
    public class QuestionDbMap : IEntityTypeConfiguration<Question>
    {
        public void Configure(EntityTypeBuilder<Question> builder)
        {
            builder.OwnsMany(q => q.Answers, builder => { builder.ToJson(); });
        }
    }
}

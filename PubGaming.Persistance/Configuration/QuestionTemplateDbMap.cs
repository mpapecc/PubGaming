using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PubGaming.Domain.Entites;

namespace PubGaming.Persistance.Configuration;

public class QuestionTemplateDbMap : IEntityTypeConfiguration<QuestionTemplate>
{
    public void Configure(EntityTypeBuilder<QuestionTemplate> builder)
    {
        builder
            .OwnsMany(q => q.Answers, builder => { builder.ToJson(); });


    }
}

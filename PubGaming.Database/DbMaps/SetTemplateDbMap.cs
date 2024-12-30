using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PubGaming.Database.Entites;


namespace PubGaming.Database.DbMaps
{
    public class SetTemplateDbMap : IEntityTypeConfiguration<SetTemplate>
    {
        public void Configure(EntityTypeBuilder<SetTemplate> builder)
        {
            builder
            .Navigation(x => x.Questions)
            .AutoInclude();

            builder
            .HasMany(x => x.Questions)
            .WithMany(x => x.SetTemplates)
            .UsingEntity<SetTemplateQuestionTemplate>(
            l => l.HasOne(x => x.QuestionTemplate).WithMany(x => x.SetTemplateQuestionTemplates),
            r => r.HasOne(x => x.SetTemplate).WithMany(x => x.SetTemplatesQuestionTemplates));
        }
    }
}

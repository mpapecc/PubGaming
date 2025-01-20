using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PubGaming.Domain.Entites;


namespace PubGaming.Persistance.Configuration
{
    public class SetTemplateQuestionTemplateDbMap : IEntityTypeConfiguration<SetTemplateQuestionTemplate>
    {
        public void Configure(EntityTypeBuilder<SetTemplateQuestionTemplate> builder)
        {
            builder
            .HasKey(x => new { x.QuestionTemplateId, x.SetTemplateId });
        }
    }
}

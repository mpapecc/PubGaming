using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PubGaming.Database.Entites;


namespace PubGaming.Database.DbMaps
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

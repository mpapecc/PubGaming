namespace PubGaming.Domain.Models
{
    public class SetTemplateDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<QuestionTemplateDto>? Questions { get; set; }
    }
}

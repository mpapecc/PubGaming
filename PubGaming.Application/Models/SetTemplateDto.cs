namespace PubGaming.Application.Models
{
    public class SetTemplateDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IList<QuestionTemplateDto>? Questions { get; set; }
    }
}

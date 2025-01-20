namespace PubGaming.Application.Models
{
    public class SetDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }
        public IList<QuestionDto>? Questions { get; set; }
    }
}

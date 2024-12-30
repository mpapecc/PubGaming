using PubGaming.Database.Entites;

namespace PubGaming.Domain.Models
{
    public class QuestionTemplateDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public QuestionType QuestionType { get; set; }
        public IList<Answer> Answers { get; set; }
    }
}

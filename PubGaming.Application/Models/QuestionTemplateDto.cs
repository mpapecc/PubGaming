using PubGaming.Domain.Entites;

namespace PubGaming.Application.Models
{
    public class QuestionTemplateDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public QuestionType QuestionType { get; set; }
        public IList<Answer> Answers { get; set; }
    }
}

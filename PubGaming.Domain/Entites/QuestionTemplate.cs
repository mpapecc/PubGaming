namespace PubGaming.Domain.Entites
{
    public class QuestionTemplate : BaseEntity
    {
        public string Text { get; set; }
        public QuestionType QuestionType { get; set; }
        public IList<Answer> Answers { get; set; }
        public IList<SetTemplate>? SetTemplates { get; set; }
        public IList<SetTemplateQuestionTemplate>? SetTemplateQuestionTemplates { get; set; }

    }

    public enum QuestionType
    {
        QuizQuestion
    }
}

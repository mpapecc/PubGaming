namespace PubGaming.Domain.Entites
{
    public class Question : BaseEntity
    {
        public string Text { get; set; }
        public QuestionType QuestionType { get; set; }
        public IList<Answer> Answers { get; set; }
        public Set? Set { get; set; }
        public int? SetId { get; set; }
    }
}

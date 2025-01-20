namespace PubGaming.Domain.Entites
{
    public class SetTemplateQuestionTemplate
    {
        public QuestionTemplate? QuestionTemplate { get; set; }
        public int QuestionTemplateId { get; set; }
        public SetTemplate? SetTemplate { get; set; }
        public int SetTemplateId { get; set; }
    }
}

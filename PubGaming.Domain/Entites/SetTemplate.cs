namespace PubGaming.Domain.Entites
{
    public class SetTemplate : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IList<QuestionTemplate>? Questions { get; set; }
        public IList<SetTemplateQuestionTemplate>? SetTemplatesQuestionTemplates { get; set; }
    }
}

﻿namespace PubGaming.Database.Entites
{
    public class SetTemplate : BaseEntity
    {
        public string Name { get; set; }
        public IList<QuestionTemplate>? Questions { get; set; }
        public IList<SetTemplateQuestionTemplate>? SetTemplatesQuestionTemplates { get; set; }
    }
}
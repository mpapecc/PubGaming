using PubGaming.Database.Entites;
using PubGaming.Domain.Models;

namespace PubGaming.Domain.Mappers
{
    public static class QuestionTemplateMappers
    {
        public static QuestionTemplateDto ToQuestionTemplateDto(this QuestionTemplate questionTemplate)
        {
            return new QuestionTemplateDto()
            {
                Id = questionTemplate.Id,
                Text = questionTemplate.Text,
                Answers = questionTemplate.Answers,
                QuestionType = questionTemplate.QuestionType
            };
        }
    }
}

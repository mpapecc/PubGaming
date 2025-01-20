using PubGaming.Application.Models;
using PubGaming.Domain.Entites;

namespace PubGaming.Application.Mappers
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

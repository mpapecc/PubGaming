using PubGaming.Application.Models;
using PubGaming.Domain.Entites;

namespace PubGaming.Application.Mappers
{
    public static class QuestionMappers
    {
        public static QuestionDto ToQuestionDto(this Question question)
        {
            return new QuestionDto()
            {
                Id = question.Id,
                Text = question.Text,
                Answers = question.Answers,
                QuestionType = question.QuestionType
            };
        }
    }
}

using PubGaming.Database.Entites;
using PubGaming.Domain.Models;

namespace PubGaming.Domain.Mappers
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

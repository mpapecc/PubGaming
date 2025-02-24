using PubGaming.Application.Models;
using PubGaming.Domain.Entites;

namespace PubGaming.Application.Pipeline.Steps
{
    public class QuizQuestion(QuestionDto question) : IStep
    {
        private readonly QuestionDto question = question;

        public void Run(Func<dynamic, Task> sendToClients)
        {
            sendToClients(new { question.Text, Answers = question.Answers.Select(x => new { x.Text, x.AnswerNo }) });
        }
    }
}

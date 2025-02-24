using PubGaming.Application.Models;
using PubGaming.Application.Pipeline.Steps;
using PubGaming.Domain.Entites;

namespace PubGaming.Application.Pipeline
{
    public class GamePipeline
    {
        private readonly IList<IStep> steps = [];
        private readonly GameSettings gameSettings;
        public IStep CurrentStep { get; set; }

        public GamePipeline(GameSettings gameSettings, IList<SetDto> sets)
        {
            this.gameSettings = gameSettings;

            PreProcessSteps(sets);
        }

        public void RunAsync(Func<dynamic, Task> sendToClients)
        {
            Task.Run(async () =>
            {
                foreach (var step in steps)
                {
                    step.Run(sendToClients);
                    CurrentStep = step;
                    await Task.Delay(gameSettings.StepDuration * 1000);
                }
            });
        }

        public void Register(IStep step)
        {
            steps.Add(step);
        }

        public virtual void PreProcessSteps(IList<SetDto> sets)
        {
            Register(new DelayStep(gameSettings.StartDelay, DelayType.BeforeGame));

            foreach (var set in sets)
            {
                foreach (var question in set.Questions)
                {
                    var step = GetStepObjectByQuestionType(question);
                    Register(step);
                }

                Register(new DelayStep(gameSettings.PauseBetweenSets, DelayType.AfterSet));
            }

            Register(new DelayStep(gameSettings.EndDelay, DelayType.AfterGame));
        }

        private static IStep GetStepObjectByQuestionType(QuestionDto question)
        {
            switch (question.QuestionType)
            {
                case QuestionType.QuizQuestion:
                    return new QuizQuestion(question);
                default:
                    throw new Exception($"{question.QuestionType} does not have dedicated class.");
            }
        }
    }
}

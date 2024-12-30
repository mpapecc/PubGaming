using PubGaming.Database.Entites;
using PubGaming.Domain.Pipeline.Steps;

namespace PubGaming.Domain.Pipeline
{
    public class GamePipeline
    {
        private readonly IList<IStep> steps = [];
        private readonly GameSettings gameSettings;

        public GamePipeline(GameSettings gameSettings, IList<Set> sets)
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
                    await Task.Delay(gameSettings.StepDuration * 1000);
                }
            });
        }

        public void Register(IStep step)
        {
            steps.Add(step);
        }

        public virtual void PreProcessSteps(IList<Set> sets)
        {
            this.Register(new DelayStep(gameSettings.StartDelay, DelayType.BeforeGame));

            foreach (var set in sets)
            {
                foreach (var question in set.Questions)
                {
                    var step = GetStepObjectByQuestionType(question);
                    this.Register(step);
                }

                this.Register(new DelayStep(gameSettings.PauseBetweenSets, DelayType.AfterSet));
            }

            this.Register(new DelayStep(gameSettings.EndDelay, DelayType.AfterGame));
        }

        private static IStep GetStepObjectByQuestionType(Question question)
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

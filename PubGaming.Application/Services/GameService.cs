using PubGaming.Application.Mappers;
using PubGaming.Application.Models;
using PubGaming.Common.Enums;
using PubGaming.Domain.Entites;

namespace PubGaming.Application.Services
{
    public class GameService(
        IRepository<Game> gameRepository,
        IRepository<Set> setRepository,
        IRepository<Question> questionRepository
        )
    {
        private readonly IRepository<Game> gameRepository = gameRepository;
        private readonly IRepository<Set> setRepository = setRepository;
        private readonly IRepository<Question> questionRepository = questionRepository;

        public GameDto UpdateQuiz(Game game)
        {
            var persistedQuiz = gameRepository.Query().Where(x => x.Id == game.Id).FirstOrDefault();

            if (persistedQuiz == null)
                throw new ArgumentException($"Game with id {game.Id} does not exists");
            else
            {
                persistedQuiz.Name = game.Name;
                persistedQuiz.Description = game.Description;

                var deletedSets = persistedQuiz.Sets.Where(ps => !game.Sets.Any(s => s.Id == ps.Id));
                setRepository.DeleteRange(deletedSets);

                var sets = game.Sets.GroupBy(s => s.Id == default);

                var newSets = sets.FirstOrDefault(x => x.Key == true);
                var existingSets = sets.FirstOrDefault(x => x.Key == false);

                if (newSets != null)
                    setRepository.CreateRange(newSets);

                if (existingSets != null)
                {
                    foreach (var existingSet in existingSets)
                    {
                        var persistedSet = persistedQuiz.Sets.First(x => x.Id == existingSet.Id);
                        persistedSet.Name = existingSet.Name;

                        var deletedQuestion = persistedSet.Questions.Where(pq => !existingSet.Questions.Any(q => q.Id == pq.Id));
                        questionRepository.DeleteRange(deletedQuestion);

                        var questions = existingSet.Questions.GroupBy(q => q.Id == default);

                        var newQuestions = questions.FirstOrDefault(x => x.Key == true);
                        var existingQuestions = questions.FirstOrDefault(x => x.Key == false);

                        if (newQuestions != null)
                            questionRepository.CreateRange(newQuestions);

                        if (existingQuestions != null)
                        {
                            foreach (var existingQuestion in existingQuestions)
                            {
                                var persistedQuestion = persistedSet.Questions.First(x => x.Id == existingQuestion.Id);

                                persistedQuestion.Text = existingQuestion.Text;
                                persistedQuestion.Answers = existingQuestion.Answers;
                            }
                        }
                    }
                }

            }

            setRepository.Commit();
            return persistedQuiz.ToGameDto();
        }

        public GameDto CreateEmptyGame()
        {
            var quiz = new Game()
            {
                Name = "New Quiz",
                Description = "",
                GameType = GameType.Quiz,
                Sets = [new Set() { Name = "New Quiz Set", Description = "", Questions = new List<Question>() }]
            };
            gameRepository.Create(quiz);
            gameRepository.Commit();

            return quiz.ToGameDto();
        }
    }
}

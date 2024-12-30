using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PubGaming.Database.Entites;
using PubGaming.Domain.Models;
using PubGaming.Domain.Mappers;
using PubGaming.Domain.Patterns.Repositories;
using PubGaming.Domain.Services;

namespace PubGaming.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController(
        IRepository<Game> quizRepository,
        GameService quizService
        ) : ControllerBase
    {
        private readonly IRepository<Game> quizRepository = quizRepository;
        private readonly GameService quizService = quizService;

        [HttpGet, Route(nameof(GetGamesList))]
        public IList<GameDto> GetGamesList(int pageSize = 50, int pageNo = 1)
        {
            return quizRepository.Query()
                .AsNoTracking()
                .Skip((pageSize - 1) * pageNo)
                .Take(pageSize)
                .Select(x => x.ToGameDto())
                .ToList();
        }

        [HttpGet, Route(nameof(GetGameTemplateById))]
        public GameDto GetGameTemplateById(int id)
        {
            var quiz = quizRepository.Query().Where(q => q.Id == id).FirstOrDefault();
            if (quiz != null)
                return quiz.ToGameDto();

            throw new ArgumentException($"Quiz with id {id} does not exists");
        }

        [HttpPost, Route(nameof(CreateGameTemplate))]
        public void CreateGameTemplate(Game quizTemplate)
        {
            quizRepository.Create(quizTemplate);
            quizRepository.Commit();
        }
        
        [HttpGet, Route(nameof(CreateEmptyGame))]
        public GameDto CreateEmptyGame()
        {
            return this.quizService.CreateEmptyGame();
        }

        [HttpPut, Route(nameof(UpdateGame))]
        public GameDto UpdateGame(Game quiz)
        {
            var item = quizService.UpdateQuiz1(quiz);

            return quiz.ToGameDto();
        }
    }
}


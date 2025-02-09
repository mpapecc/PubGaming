using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PubGaming.Application;
using PubGaming.Application.Mappers;
using PubGaming.Application.Models;
using PubGaming.Application.Services;
using PubGaming.Domain.Entites;

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
        public GameDto GetGameTemplateById(int entityId)
        {
            var quiz = quizRepository.Query().Where(q => q.Id == entityId).FirstOrDefault();
            if (quiz != null)
                return quiz.ToGameDto();

            throw new ArgumentException($"Quiz with id {entityId} does not exists");
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
            var item = quizService.UpdateQuiz(quiz);

            return quiz.ToGameDto();
        }
    }
}


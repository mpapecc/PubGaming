using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PubGaming.Database.Entites;
using PubGaming.Domain.Models;
using PubGaming.Domain.Mappers;
using PubGaming.Domain.Patterns.Repositories;

namespace PubGaming.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionTemplateController(IRepository<QuestionTemplate> quizQuestionTemplateRepository) : ControllerBase
    {
        private readonly IRepository<QuestionTemplate> quizQuestionTemplateRepository = quizQuestionTemplateRepository;

        [HttpPost]
        [Route(nameof(CreateQuestionTemplate))]

        public QuestionTemplateDto CreateQuestionTemplate(QuestionTemplate quizQuestion)
        {
            quizQuestionTemplateRepository.Create(quizQuestion);
            quizQuestionTemplateRepository.Commit();

            return quizQuestion.ToQuestionTemplateDto();
        }

        [HttpGet]
        [Route(nameof(GetTemplateQuestions))]
        public IList<QuestionTemplateDto> GetTemplateQuestions(int pageSize, int pageNo)
        {
            return quizQuestionTemplateRepository.Query()
                .AsNoTracking()
                .Skip((pageSize - 1) * pageNo)
                .Take(pageSize)
                .Select(x => x.ToQuestionTemplateDto())
                .ToList();
        }

        [HttpGet]
        [Route(nameof(GetTemplateQuestionById))]
        public QuestionTemplate? GetTemplateQuestionById(int id)
        {
            return quizQuestionTemplateRepository.Query().Where(q => q.Id == id).FirstOrDefault(); ;
        }
    }
}

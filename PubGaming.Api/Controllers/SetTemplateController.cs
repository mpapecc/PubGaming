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
    public class SetTemplateController(
        IRepository<SetTemplate> quizSetTemplateRepository,
        SetTemplateService quizSetTemplateService
        ) : ControllerBase
    {
        private readonly IRepository<SetTemplate> quizSetTemplateRepository = quizSetTemplateRepository;
        private readonly SetTemplateService quizSetTemplateService = quizSetTemplateService;

        [HttpPost, Route(nameof(CreateNewEmptySet))]
        public void CreateNewEmptySet(int quizId, string name)
        {
            var set = new SetTemplate()
            {
                Name = name
            };

            quizSetTemplateRepository.Create(set);
            quizSetTemplateRepository.Commit();
        }

        [HttpPost, Route(nameof(CreateNewSet))]
        public SetTemplateDto CreateNewSet(SetTemplate setTemplate)
        {
            return quizSetTemplateService.CreateNewSetTemplate(setTemplate).ToSetTemplateDto();
        }

        [HttpPost, Route(nameof(UpdateSet))]
        public void UpdateSet(SetTemplate setTemplate)
        {
            var set = quizSetTemplateService.UpdateSetTemplate(setTemplate);
            quizSetTemplateRepository.Commit();
        }

        [HttpGet, Route(nameof(GetSetTemplateById))]
        public SetTemplateDto GetSetTemplateById(int id)
        {
            var set = quizSetTemplateRepository.Query()
                .Where(x => x.Id == id)
                .FirstOrDefault();

            if (set == null)
                throw new ArgumentException($"Set with id {id} does not exist");

            return set.ToSetTemplateDto();
        }

        [HttpPost, Route(nameof(GetSetTemplateByIdList))]
        public IList<SetTemplateDto> GetSetTemplateByIdList([FromBody] IList<int> idList)
        {
            var sets = quizSetTemplateRepository.Query()
                .Where(x => idList.Contains(x.Id))
                .Select(x => x.ToSetTemplateDto())
                .ToList();

            if (sets.Count != idList.Count)
                throw new ArgumentException($"Retrieved list length is not same as requested ids list. ");

            return sets;
        }

        [HttpGet, Route(nameof(GetSetTemplates))]
        public IList<SetTemplateDto> GetSetTemplates(int pageSize = 50, int pageNo = 1)
        {
            return SearchSetTemplates(pageSize, pageNo)
                    .Select(x => x.ToSetTemplateDto())
                    .ToList();
        }

        [HttpGet, Route(nameof(SearchSetTemplatesByName))]
        public IList<SetTemplateDto> SearchSetTemplatesByName(string name, int pageSize = 50, int pageNo = 1)
        {
            return SearchSetTemplates(pageSize, pageNo)
                    .Where(x => x.Name.Contains(name, StringComparison.InvariantCultureIgnoreCase))
                    .Select(x => x.ToSetTemplateDto())
                    .ToList();
        }

        private IQueryable<SetTemplate> SearchSetTemplates(int pageSize = 50, int pageNo = 1)
        {
            return quizSetTemplateRepository.Query()
                .AsNoTracking()
                .Skip((pageSize - 1) * pageNo)
                .Take(pageSize);
        }
    }
}

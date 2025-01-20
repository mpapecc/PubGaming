using PubGaming.Application.Models;
using PubGaming.Domain.Entites;

namespace PubGaming.Application.Mappers
{
    public static class SetTemplateMappers
    {
        public static SetTemplateDto ToSetTemplateDto(this SetTemplate setTemplate)
        {
            return new SetTemplateDto()
            {
                Id = setTemplate.Id,
                Name = setTemplate.Name,
                Description = setTemplate.Description,
                Questions = setTemplate.Questions?.Select(x => x.ToQuestionTemplateDto()).ToList()
            };
        }
    }
}

using PubGaming.Database.Entites;
using PubGaming.Domain.Models;

namespace PubGaming.Domain.Mappers
{
    public static class SetTemplateMappers
    {
        public static SetTemplateDto ToSetTemplateDto(this SetTemplate setTemplate)
        {
            return new SetTemplateDto()
            {
                Id = setTemplate.Id,
                Name = setTemplate.Name,
                Questions = setTemplate.Questions?.Select(x => x.ToQuestionTemplateDto()).ToList()
            };
        }
    }
}

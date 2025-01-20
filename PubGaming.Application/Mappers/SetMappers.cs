using PubGaming.Application.Models;
using PubGaming.Domain.Entites;

namespace PubGaming.Application.Mappers
{
    public static class SetMappers
    {
        public static SetDto ToSetDto(this Set set)
        {
            return new SetDto()
            {
                Id = set.Id,
                Name = set.Name,
                Description = set.Description,
                Questions = set.Questions?.Select(x => x.ToQuestionDto()).ToList()
            };
        }
    }
}

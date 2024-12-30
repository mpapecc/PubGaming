using PubGaming.Database.Entites;
using PubGaming.Domain.Models;

namespace PubGaming.Domain.Mappers
{
    public static class SetMappers
    {
        public static SetDto ToSetDto(this Set set)
        {
            return new SetDto()
            {
                Id = set.Id,
                Name = set.Name,
                Questions = set.Questions?.Select(x => x.ToQuestionDto()).ToList()
            };
        }
    }
}

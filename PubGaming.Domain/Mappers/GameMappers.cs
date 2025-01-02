using PubGaming.Database.Entites;
using PubGaming.Domain.Models;

namespace PubGaming.Domain.Mappers
{
    public static class GameMappers
    {
        public static GameDto ToGameDto(this Game game)
        {
            return new GameDto()
            {
                Id = game.Id,
                Name = game.Name,
                Description = game.Description,
                GameType = game.GameType,
                Sets = game.Sets?.Select(x => x.ToSetDto()).ToList(),
            };
        }
    }
}

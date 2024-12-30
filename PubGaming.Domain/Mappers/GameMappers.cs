using PubGaming.Database.Entites;
using PubGaming.Domain.Models;

namespace PubGaming.Domain.Mappers
{
    public static class GameMappers
    {
        public static GameDto ToGameDto(this Game quiz)
        {
            return new GameDto()
            {
                Id = quiz.Id,
                Name = quiz.Name,
                GameType = quiz.GameType,
                Sets = quiz.Sets?.Select(x => x.ToSetDto()).ToList(),
            };
        }
    }
}

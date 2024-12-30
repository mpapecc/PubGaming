using PubGaming.Database;

namespace PubGaming.Domain.Models
{
    public class GameDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public GameType GameType { get; set; }
        public IList<SetDto>? Sets { get; set; }
    }
}

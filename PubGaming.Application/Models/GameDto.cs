using PubGaming.Common.Enums;

namespace PubGaming.Application.Models
{
    public class GameDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public GameType GameType { get; set; }
        public IList<SetDto>? Sets { get; set; }
    }
}

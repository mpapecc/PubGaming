using PubGaming.Common.Enums;

namespace PubGaming.Domain.Entites
{
    public class Game : BaseEntity
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public GameType GameType { get; set; }
        public IList<Set> Sets { get; set; }
    }
}

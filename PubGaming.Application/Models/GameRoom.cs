using PubGaming.Application.Pipeline;

namespace PubGaming.Application.Models
{
    public class GameRoom(string name, int id, string adminConnectionId)
    {
        public readonly string name = name;
        public readonly int id = id;
        public string adminConnectionId = adminConnectionId;
        public IList<PlayerData> playersConnectionIds = new List<PlayerData>();
        public int GameId { get; set; }
        public GameDto? Game { get; set; }
        public GamePipeline? GamePipeline { get; set; }
    }
}

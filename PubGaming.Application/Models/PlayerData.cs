namespace PubGaming.Application.Models
{
    public record PlayerData
    {
        public PlayerData(string ConnectionId, string Name)
        {
            this.ConnectionId = ConnectionId;
            this.Name = Name;
        }

        public string ConnectionId { get; set; }
        public string Name { get; set; }
    }
}

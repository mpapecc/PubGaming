namespace PubGaming.Api.Hub
{
    public interface IGameHubClient
    {
        Task Connected(object connectionId);
        Task CreatedGameRoom(object groupId);
        Task NotifyGroupPlayerJoinedRoom(object playerName);
        Task NotifyAdminPlayerJoinedRoom(object playerName);
        Task SelectGame(string gameType, string gameId);
        Task SendStepToCLients(dynamic data);
    }
}

namespace PubGaming.Api.Hub
{
    public interface IGameHubClient
    {
        Task Connected(object connectionId);
        Task CreatedGameRoom(object groupId);
        Task NotifyGroupPlayerJoinedRoom(object playerName);
        Task NotifyAdminPlayerJoinedRoom(object playerName);
        Task SelectGame(int gameType, int gameId);
        Task SendStepToCLients(dynamic data);
        Task RedirectToUrl(string url);
    }
}

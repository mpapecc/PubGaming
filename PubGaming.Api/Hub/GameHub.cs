using Microsoft.AspNetCore.SignalR;
using PubGaming.Database.Entites;
using PubGaming.Domain.Patterns.Repositories;
using PubGaming.Domain.Pipeline;

namespace PubGaming.Api.Hub
{
    public class GameHub(IRepository<Game> gameRepository) : Hub<IGameHubClient>
    {
        private static int _roomId = 1;
        private static Dictionary<int, GameRoom> gameRooms = [];
        private readonly IRepository<Game> gameRepository = gameRepository;

        public Task Connected(string connectionId)
        {
            return Clients.Client(connectionId).Connected(connectionId);
        }

        public int CreateGameRoom(string name)
        {
            Groups.AddToGroupAsync(Context.ConnectionId, name);

            var gameRoom = new GameRoom(name, _roomId, Context.ConnectionId);
            gameRooms.Add(_roomId, gameRoom);

            _roomId++;
            return gameRoom.id;
        }

        public void JoinRoom(string playerName, string roomId)
        {
            int roomIdInt = int.Parse(roomId);
            var gameRoom = gameRooms[roomIdInt];

            Groups.AddToGroupAsync(Context.ConnectionId, gameRoom.name);

            Clients.GroupExcept(gameRoom.name, [gameRoom.adminConnectionId, Context.ConnectionId]).NotifyGroupPlayerJoinedRoom(playerName);
            Clients.Client(gameRoom.adminConnectionId).NotifyAdminPlayerJoinedRoom(playerName);
        }

        public void SelectGame(int roomId, int gameId)
        {
            var gameRoom = gameRooms[roomId];
            gameRoom.GameId = gameId;
        }

        public void StartGame(int roomId)
        {
            var gameRoom = gameRooms[roomId];
            var sets = this.gameRepository.Query()
                .Where(x => x.Id == gameRoom.GameId)
                .Select(x => x.Sets)
                .FirstOrDefault();

            var quizSettings = new GameSettings() 
            { 
                StepDuration = 10, 
                PauseBetweenSets = 20 
            };
            var gamePipeline = new GamePipeline(quizSettings, sets);

            gamePipeline.RunAsync(Clients.GroupExcept(gameRoom.name, [gameRoom.adminConnectionId]).SendStepToCLients);

        }
    }

    public class GameRoom(string name, int id, string adminConnectionId)
    {
        public readonly string name = name;
        public readonly int id = id;
        public readonly string adminConnectionId = adminConnectionId;
        public int GameId { get; set; }
    }
}

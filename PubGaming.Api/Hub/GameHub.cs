using Microsoft.AspNetCore.SignalR;
using PubGaming.Application;
using PubGaming.Application.Pipeline;
using PubGaming.Domain.Entites;

namespace PubGaming.Api.Hub
{
    public class GameHub(IRepository<Game> gameRepository) : Hub<IGameHubClient>
    {
        private static int _roomId = 1;
        private static int _hostId = 1;
        //private static Dictionary<string, GameRoom> gameRooms = [];
        public static Dictionary<string, Dictionary<int, GameRoom>> hosts = [];
        private readonly IRepository<Game> gameRepository = gameRepository;

        public override Task OnConnectedAsync()
        {
            Clients.Client(Context.ConnectionId).Connected(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public void ReconnectHostWithNewConnectionId(string oldConnectionId)
        {
            var isHostActive = hosts.TryGetValue(oldConnectionId, out var hostData);

            if (hostData == null)
                return;

            foreach (var roomDictionary in hostData)
            {
                var gameRoom = roomDictionary.Value;

                gameRoom.adminConnectionId = Context.ConnectionId;
                Groups.AddToGroupAsync(Context.ConnectionId, gameRoom.name);
            }

            hosts.Remove(oldConnectionId);
            hosts.Add(Context.ConnectionId, hostData);
        }

        public int CreateGameRoom(string name)
        {
            // this is host group with all players in all roms
            Groups.AddToGroupAsync(Context.ConnectionId, _hostId.ToString());
            // this is group for specifi room/game
            Groups.AddToGroupAsync(Context.ConnectionId, _roomId.ToString());

            var gameRoom = new GameRoom(name, _roomId, Context.ConnectionId);
            var isAdded = hosts.TryAdd(Context.ConnectionId, new Dictionary<int, GameRoom>() { { _roomId, gameRoom } });
            if (!isAdded)
            {
                hosts[Context.ConnectionId].Add(_roomId, gameRoom);
            }

            _roomId++;
            return gameRoom.id;
        }

        public void JoinRoom(string playerName, int roomId)
        {
            var gameRoom = GetGameRoom(roomId);

            Groups.AddToGroupAsync(Context.ConnectionId, gameRoom.name);

            Clients.GroupExcept(gameRoom.name, [gameRoom.adminConnectionId, Context.ConnectionId]).NotifyGroupPlayerJoinedRoom(playerName);
            Clients.Client(gameRoom.adminConnectionId).NotifyAdminPlayerJoinedRoom(playerName);
        }

        public void SelectGame(int roomId, int gameId)
        {
            var gameRoom = GetGameRoom(roomId);
            gameRoom.GameId = gameId;
        }

        public void StartGame(int roomId)
        {
            var gameRoom = GetGameRoom(roomId); 
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

            gamePipeline.RunAsync(Clients.Group(gameRoom.name).SendStepToCLients);

        }

        private static GameRoom GetGameRoom(int roomId)
        {
            var hostOfRoom = hosts.FirstOrDefault(x => x.Value.ContainsKey(roomId)).Value;

            if (hostOfRoom == null)
            {
                throw new Exception("Room does not exists");
            }

            return hostOfRoom[roomId];
        }
    }

    public class GameRoom(string name, int id, string adminConnectionId)
    {
        public readonly string name = name;
        public readonly int id = id;
        public string adminConnectionId = adminConnectionId;
        public int GameId { get; set; }
        public GamePipeline GamePipeline { get; set; }
    }
}

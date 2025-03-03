using Microsoft.AspNetCore.Mvc;
using PubGaming.Api.Hub;
using PubGaming.Application.Models;

namespace PubGaming.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController: ControllerBase
    {
        [HttpGet(nameof(GetRooms))]
        public IEnumerable<RoomData> GetRooms(string hostId)
        {
            if (GameHub.hosts.TryGetValue(hostId, out var hostData))
                return hostData?.Select(x => new RoomData { Id = x.Value.id, Name = x.Value.name});
            return [];
        }

        [HttpGet(nameof(GetRoomData))]
        public GameRoom GetRoomData(string hostId, int roomId)
        {
            if (!GameHub.hosts.TryGetValue(hostId, out var hostData))
                throw new InvalidDataException($"Host with Id {hostId} does not exists.");

            if (hostData.TryGetValue(roomId, out var roomData))
                return roomData;

            throw new InvalidDataException($"Room with Id {hostId} does not exists.");
        }
    }
}

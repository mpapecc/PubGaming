using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using PubGaming.Api.Hub;
using PubGaming.Application.Models;
using PubGaming.Domain.Entites;

namespace PubGaming.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HostController : ControllerBase
    {
        [HttpGet(nameof(IsHostActive))]
        public IsHostActiveResponse IsHostActive(string hostConnectionId, int? roomId)
        {
            var isHostActive = GameHub.hosts.TryGetValue(hostConnectionId, out var hostData);

            if (roomId == 0 || roomId == null)
                return new IsHostActiveResponse() 
                { 
                    IsHostActive = isHostActive, 
                    AvailableRooms = hostData?.Select(x => new RoomData { Game = x.Value.Game, Id = x.Value.id, Name = x.Value.name, PlayersData = x.Value.PlayersData }) 
                };

            if (hostData == null)
                return new IsHostActiveResponse() { IsHostActive = false };

            var isRoomActive = hostData.TryGetValue(roomId.Value, out var roomData);

            return new IsHostActiveResponse() 
            { 
                IsHostActive = isRoomActive, 
                AvailableRooms = hostData?.Select(x => new RoomData { Game = x.Value.Game, Id = x.Value.id, Name = x.Value.name, PlayersData = x.Value.PlayersData }) 
            };
        }
    }
}

namespace PubGaming.Application.Models
{
    public class IsHostActiveResponse
    {
        public bool IsHostActive { get; set; }
        public IEnumerable<RoomData>? AvailableRooms { get; set; }
    }
}

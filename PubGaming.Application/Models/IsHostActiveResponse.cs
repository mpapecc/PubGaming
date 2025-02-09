namespace PubGaming.Application.Models
{
    public class IsHostActiveResponse
    {
        public bool IsHostActive { get; set; }
        public IEnumerable<object>? AvailableRooms { get; set; }
    }
}

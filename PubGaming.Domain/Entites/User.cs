namespace PubGaming.Domain.Entites
{
    public class User : BaseEntity
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
    }
}

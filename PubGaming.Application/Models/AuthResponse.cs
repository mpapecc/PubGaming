namespace PubGaming.Application.Models
{
    public class AuthResponse
    {
        public AuthAction AuthAction { get; set; }
        public bool IsSuccessful { get; set; }
        public string Message { get; set; }
    }

    public enum AuthAction
    {
        Login,
        Registration,
        PasswordReset
    }
}

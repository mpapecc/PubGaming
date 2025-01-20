using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PubGaming.Application.Models;
using PubGaming.Domain.Entites;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;


namespace PubGaming.Application.Services
{
    public class AuthService(
        IRepository<User> usersRepository,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor)
    {
        private readonly IRepository<User> usersRepository = usersRepository;
        private readonly IConfiguration configuration = configuration;
        private readonly IHttpContextAccessor httpContextAccessor = httpContextAccessor;

        public AuthResponse Register(UserAuthModel userAuthModel)
        {
            var authResponse = new AuthResponse() { AuthAction = AuthAction.Registration };

            var userExists = usersRepository.Query().Any(x => x.Email == userAuthModel.Email);

            if (userExists)
            {
                authResponse.IsSuccessful = false;
                authResponse.Message = $"User with email {userAuthModel.Email} already exists.";

                return authResponse;
            }

            HashPassword(userAuthModel.Password, out byte[] salt, out byte[] hash);

            usersRepository.Create(new User { Email = userAuthModel.Email, PasswordSalt = salt, PasswordHash = hash });
            usersRepository.Commit();

            authResponse.IsSuccessful = true;
            return authResponse;
        }

        private static void HashPassword(string password, out byte[] salt, out byte[] hash)
        {
            using (var hmac = new HMACSHA256())
            {
                salt = hmac.Key;
                hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        public AuthResponse Login(UserAuthModel userAuthModel)
        {
            var authResponse = new AuthResponse() { AuthAction = AuthAction.Login };

            var user = usersRepository.Query().Where(x => x.Email == userAuthModel.Email).FirstOrDefault();

            if (user == null)
            {
                authResponse.IsSuccessful = false;
                authResponse.Message = "No such user.";

                return authResponse;
            }

            if (!VerifyPassword(userAuthModel.Password, user.PasswordSalt, user.PasswordHash))
            {
                authResponse.IsSuccessful = false;
                authResponse.Message = "Incorrect password.";

                return authResponse;
            }

            authResponse.IsSuccessful = true;
            authResponse.Message = CreateJwt(user, configuration);
            CreateCookie(user, httpContextAccessor);
            return authResponse;
        }

        private static bool VerifyPassword(string password, byte[] salt, byte[] hash)
        {
            using (var hmac = new HMACSHA256(salt))
            {
                return hmac.ComputeHash(Encoding.UTF8.GetBytes(password)).SequenceEqual(hash);
            }
        }

        private static string CreateJwt(User user, IConfiguration configuration)
        {
            var claims = new List<Claim>()
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new("Id", user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(configuration["Jwt:ExpirationInMinutes"])),
                signingCredentials: creds,
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"]);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async static void CreateCookie(User user, IHttpContextAccessor httpContextAccessor)
        {

            var claimsIdentity = new ClaimsIdentity(
                new List<Claim>
                {
                    new (ClaimTypes.Name, user.Email)
                }, "CookieAuth");


            await httpContextAccessor.HttpContext.SignInAsync("CookieAuth",
                new ClaimsPrincipal(claimsIdentity));

            //httpContextAccessor.HttpContext.Request.Cookies.Append()
        }

        public AuthResponse ResetPassword(UserAuthModel userAuthModel)
        {
            var authResponse = new AuthResponse() { AuthAction = AuthAction.PasswordReset };

            var user = usersRepository.Query().Where(x => x.Email == userAuthModel.Email).FirstOrDefault();

            if (user == null)
            {
                authResponse.IsSuccessful = false;
                authResponse.Message = $"User with email {userAuthModel.Email} does not exists.";

                return authResponse;
            }

            HashPassword(userAuthModel.Password, out byte[] salt, out byte[] hash);

            user.PasswordSalt = salt;
            user.PasswordHash = hash;
            usersRepository.Commit();

            authResponse.IsSuccessful = true;
            authResponse.Message = "Password successfully reseted.";

            return authResponse;
        }
    }
}

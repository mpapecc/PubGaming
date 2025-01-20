using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PubGaming.Application.Models;
using PubGaming.Application.Services;
using System.Security.Claims;

namespace PubGaming.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(
        AuthService authService,
        IHttpContextAccessor httpContextAccessor
        ) : ControllerBase
    {
        private readonly AuthService authService = authService;
        private readonly IHttpContextAccessor httpContextAccessor = httpContextAccessor;

        [HttpPost(nameof(Register))]
        public ActionResult Register(UserAuthModel user)
        {
            var registerReposnse = this.authService.Register(user);

            return registerReposnse.IsSuccessful ? Ok(registerReposnse) : BadRequest(registerReposnse);
        }

        [HttpPost(nameof(Login))]
        public ActionResult Login(UserAuthModel user)
        {
            var loginResponse = this.authService.Login(user);

            if (!loginResponse.IsSuccessful) 
            {
                return BadRequest(loginResponse);
            }

            return Ok(loginResponse) ;
        }

        [HttpPost(nameof(ResetPassword))]
        public ActionResult ResetPassword(UserAuthModel user)
        {
            var loginResponse = this.authService.ResetPassword(user);

            return loginResponse.IsSuccessful ? Ok(loginResponse) : BadRequest(loginResponse);
        }

        [HttpGet, Authorize]
        public void Test()
        {
            var aa = HttpContext.User.Claims.Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault();


            var user = User;

           
        }
    }
}

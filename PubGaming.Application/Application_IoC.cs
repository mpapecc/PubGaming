using Microsoft.Extensions.DependencyInjection;
using PubGaming.Application.Services;

namespace PubGaming.Application
{
    public static class Application_IoC
    {
        public static IServiceCollection RegisterApplication_Ioc(this IServiceCollection services)
        {
            services.AddScoped<GameService>();
            services.AddScoped<SetTemplateService>();
            services.AddScoped<AuthService>();

            return services;
        }
    }
}

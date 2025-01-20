using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PubGaming.Application;
using PubGaming.Persistance.Repositories;

namespace PubGaming.Persistance
{
    public static class Persistance_Ioc
    {
        public static IServiceCollection RegisterPersistance_Ioc(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<PgDbContext>(options =>
            {
                options.UseNpgsql(connectionString);
            });
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            return services;
        }
    }
}

using Microsoft.EntityFrameworkCore;
using PubGaming.Domain.Entites;

namespace PubGaming.Persistance
{
    public class PgDbContext : DbContext
    {
        public PgDbContext(DbContextOptions<PgDbContext> options) : base(options)
        {

        }

        public DbSet<Game> Games { get; set; }
        public DbSet<Set> Sets { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<SetTemplate> SetTemplates { get; set; }
        public DbSet<QuestionTemplate> QuestionTemplates { get; set; }
        public DbSet<SetTemplateQuestionTemplate> SetTemplatesQuestionTemplates { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(PgDbContext).Assembly);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using PubGaming.Api.Hub;
using PubGaming.Database;
using PubGaming.Domain.Patterns.Repositories;
using PubGaming.Domain.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(x =>
   x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "pubGameDev",
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:4200")
                                .AllowAnyMethod()
                                .AllowAnyHeader();
                      });
});
builder.Services.AddSignalR();

builder.Services.AddDbContext<PgDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default"));
});

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

builder.Services.AddScoped<GameService>();
builder.Services.AddScoped<SetTemplateService>();

builder.Services.AddProblemDetails();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors("pubGameDev");

app.MapControllers();
app.MapHub<GameHub>("/game");
app.Run();

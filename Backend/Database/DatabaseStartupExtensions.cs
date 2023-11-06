namespace Backend.Database;

using Backend.Extensions;
using Microsoft.EntityFrameworkCore;

public static class DatabaseStartupExtensions
{
  public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
  {
    var config = configuration.GetTyped<DatabaseConfiguration>();

    if (!string.IsNullOrWhiteSpace(config.AccountKey))
    {
      services.AddDbContext<ConversationContext>(options => options.UseCosmos(config.AccountEndpoint.NotNull().NotWhiteSpace(),
                                                                              config.AccountKey.NotNull().NotWhiteSpace(),
                                                                              config.DatabaseName.NotNull().NotWhiteSpace()));
    }

    return services;
  }

  public static WebApplication UseDababase(this WebApplication app, IConfiguration configuration)
  {
    var config = configuration.GetTyped<DatabaseConfiguration>();

    if (!string.IsNullOrWhiteSpace(config.AccountKey))
    {
      using var scope = app.Services.CreateScope();
      var services = scope.ServiceProvider;

      var context = services.GetRequiredService<ConversationContext>();

      if (config.Rebuild)
      {
        context.Database.EnsureDeleted();
      }
      context.Database.EnsureCreated();
    }

    return app;
  }
}

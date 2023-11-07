namespace Backend.Database;

using Backend.Extensions;
using Microsoft.EntityFrameworkCore;

public static class DatabaseStartupExtensions
{
  public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
  {
    var config = configuration.GetTyped<BackendConfiguration>();

    if (!config.UseMock && config.UseHistory)
    {
      var dbConfig = configuration.GetTyped<DatabaseConfiguration>();
      services.AddDbContext<ConversationContext>(options => options.UseCosmos(dbConfig.AccountEndpoint.NotNull().NotWhiteSpace(),
                                                                              dbConfig.AccountKey.NotNull().NotWhiteSpace(),
                                                                              dbConfig.DatabaseName.NotNull().NotWhiteSpace()));
    }

    return services;
  }

  public static WebApplication UseDababase(this WebApplication app, IConfiguration configuration)
  {
    var config = configuration.GetTyped<BackendConfiguration>();

    if (!config.UseMock && config.UseHistory)
    {
      var dbConfig = configuration.GetTyped<DatabaseConfiguration>();
      using var scope = app.Services.CreateScope();
      var services = scope.ServiceProvider;

      var context = services.GetRequiredService<ConversationContext>();

      if (dbConfig.Rebuild)
      {
        context.Database.EnsureDeleted();
      }
      context.Database.EnsureCreated();
    }

    return app;
  }
}

namespace Backend.Clients.History;

using Backend.Extensions;

public static class HistoryClientStartupExtensions
{
  public static IServiceCollection AddHistoryClient(this IServiceCollection services, IConfiguration configuration)
  {
    var config = configuration.GetTyped<BackendConfiguration>();

    return config.UseHistory
      ? config.UseMock ? services.AddSingleton<IHistoryClient, HistoryMockClient>()
                       : services.AddScoped<IHistoryClient, HistoryClient>()
      : services;
  }
}

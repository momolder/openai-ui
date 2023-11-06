namespace Backend.Clients.OpenAi;

using Backend.Extensions;

public static class OpenAiClientStartupExtensions
{
  public static IServiceCollection AddOpenAiClient(this IServiceCollection services, IConfiguration configuration)
  {
    var config = configuration.GetTyped<BackendConfiguration>();
    return config.UseMock ? services.AddSingleton<IOpenAiClient, OpenAiMockClient>()
                          : services.AddSingleton<IOpenAiClient, OpenAiClient>();
  }
}

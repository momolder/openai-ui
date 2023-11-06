namespace Backend.Clients.Authentication;
using Backend.Extensions;

public static class AuthenticationStartupExtensions
{
  public static IServiceCollection AddAuthenticationClient(this IServiceCollection services, IConfiguration configuration)
  {
    var config = configuration.GetTyped<BackendConfiguration>();
    return config.UseMock
    ? services.AddSingleton<IAuthenticationClient, MockAuthenticationClient>()
    : services.AddSingleton<IAuthenticationClient, AuthenticationClient>();
  }
}

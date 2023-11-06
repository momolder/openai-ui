namespace Backend.Clients.Authentication;

using System.IdentityModel.Tokens.Jwt;
using Backend.Contracts;

internal class AuthenticationClient : IAuthenticationClient
{
  private async Task<JwtSecurityToken?> GetToken(HttpRequest request)
  {
    var idToken = "X-MS-TOKEN-AAD-ID-TOKEN";
    return request.Headers.ContainsKey(idToken)
    ? await Task.FromResult(new JwtSecurityToken(request.Headers[idToken]))
    : await Task.FromResult((JwtSecurityToken?) null);
  }

  public Task<UserInformation> GetUserInformation(HttpRequest request)
  {
    var userId = GetHeaderValue(request, "X-Ms-Client-Principal-Id");
    var userDisplayName = GetHeaderValue(request, "X-Ms-Client-Principal-Name");
    return Task.FromResult(new UserInformation(userId, userDisplayName));
  }

  public Task<bool> ValidateUserInformation(HttpRequest request, UserInformation user)
  {
    var userId = GetHeaderValue(request, "X-Ms-Client-Principal-Id");
    var userDisplayName = GetHeaderValue(request, "X-Ms-Client-Principal-Name");
    return Task.FromResult(user.Id == userId && user.DisplayName == userDisplayName);
  }

  private static string GetHeaderValue(HttpRequest request, string key)
    => request.Headers.ContainsKey(key)
    ? request.Headers[key].SingleOrDefault() ?? string.Empty
    : string.Empty;
}

namespace Backend.Clients.Authentication;

using Backend.Contracts;

public class MockAuthenticationClient : IAuthenticationClient
{
  private readonly List<UserInformation> users = [];
  public Task<UserInformation> GetUserInformation(HttpRequest request)
  {
    var user = new UserInformation(Id: $"Mock-{users.Count}", DisplayName: $"Mock-User-{users.Count}");
    users.Add(user);
    return Task.FromResult(user);
  }
  public Task<bool> ValidateUserInformation(HttpRequest request, UserInformation user)
    => Task.FromResult(users.Any(u => u.Id == user.Id));
}

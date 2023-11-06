namespace Backend.Clients.Authentication;

using Backend.Contracts;

public interface IAuthenticationClient
{
  Task<UserInformation> GetUserInformation(HttpRequest request);
  Task<bool> ValidateUserInformation(HttpRequest request, UserInformation user);
}

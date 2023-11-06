namespace Backend.Controllers;

using System.Net;
using Backend.Clients.Authentication;
using Backend.Contracts;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthenticationController(IAuthenticationClient authenticationClient) : ControllerBase
{
  private readonly IAuthenticationClient authenticationClient = authenticationClient;

  [HttpGet("user")]
  [ProducesResponseType(typeof(UserInformation), (int) HttpStatusCode.OK)]
  public async Task<ActionResult<UserInformation>> GetUser()
    => await authenticationClient.GetUserInformation(Request);


  [HttpPut("user/validate")]
  [ProducesResponseType(typeof(bool), (int) HttpStatusCode.OK)]
  public async Task<ActionResult<bool>> ValidateUser([FromBody] UserInformation user)
    => await authenticationClient.ValidateUserInformation(Request, user);
}

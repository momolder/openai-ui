namespace Backend.Controllers;

using System.Net;
using Backend.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

[ApiController]
[Route("api/[controller]")]
public class SettingsController(IConfiguration configuration) : ControllerBase
{
  private readonly IConfiguration configuration = configuration;

  [HttpGet()]
  [ProducesResponseType(typeof(BackendConfiguration), (int) HttpStatusCode.OK)]
  public ActionResult<BackendConfiguration> GetSettings()
    => configuration.GetTyped<BackendConfiguration>();
}

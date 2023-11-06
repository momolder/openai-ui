namespace Backend.Controllers;

using System.Net;
using Backend.Clients.History;
using Backend.Contracts;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class HistoryController(IHistoryClient historyClient) : ControllerBase
{
  private readonly IHistoryClient historyClient = historyClient;

  [HttpGet("user/{userId}")]
  [ProducesResponseType(typeof(List<Conversation>), (int) HttpStatusCode.OK)]
  public async Task<ActionResult<List<Conversation>>> GetConversations([FromRoute] string userId)
    => await historyClient.Load(userId);

  [HttpPost()]
  [ProducesResponseType(typeof(Conversation), (int) HttpStatusCode.OK)]
  public async Task<ActionResult<Conversation>> AddConversation([FromBody] Conversation conversation)
    => await historyClient.Save(conversation);

  [HttpPut()]
  [ProducesResponseType(typeof(Conversation), (int) HttpStatusCode.OK)]
  public async Task<ActionResult<Conversation>> UpdateConversation([FromBody] Conversation conversation)
    => await historyClient.Update(conversation);

  [HttpDelete()]
  [ProducesResponseType(typeof(List<Conversation>), (int) HttpStatusCode.OK)]
  public async Task<ActionResult<List<Conversation>>> DeleteConversation([FromBody] Conversation conversation)
    => await historyClient.Remove(conversation);

  [HttpDelete("user/{userId}")]
  [ProducesResponseType((int) HttpStatusCode.OK)]
  public async Task ClearConversations([FromRoute] string userId)
  => await historyClient.Clear(userId);
}

namespace Backend.Controllers;

using System.Net;
using Backend.Clients.OpenAi;
using Backend.Contracts;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ConversationController(IOpenAiClient openAiClient) : ControllerBase
{
  private readonly IOpenAiClient openAiClient = openAiClient;

  [HttpPost()]
  [ProducesResponseType(typeof(ChatMessage), (int) HttpStatusCode.OK)]
  public async Task<ActionResult<ChatMessage?>> GetResponse([FromBody] Conversation conversation)
    => await openAiClient.GetChatCompletions(conversation.Messages);

}

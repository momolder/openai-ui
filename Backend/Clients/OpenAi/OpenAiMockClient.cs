namespace Backend.Clients.OpenAi;

using Backend.Contracts;
using Backend.Extensions;

internal class OpenAiMockClient : IOpenAiClient
{
  public async Task<ChatMessage?> GetChatCompletions(ICollection<ChatMessage> messages)
    => await Task.FromResult(new ChatMessage(ChatRole.Assistant, $"Response to {messages.Last().Content}"))
                 .Delay(2000);
}

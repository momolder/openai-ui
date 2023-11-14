namespace Backend.Clients.OpenAi;

using System.Runtime.CompilerServices;
using Backend.Contracts;
using Backend.Extensions;

internal class OpenAiMockClient : IOpenAiClient
{
  public async Task<ChatMessage?> GetChatCompletions(ICollection<ChatMessage> messages)
    => await Task.FromResult(new ChatMessage(ChatRole.Assistant, $"Response to {messages.Last().Content}"))
                 .Delay(2000);
  public async IAsyncEnumerable<string> GetChatCompletionsAsyncEnumerable(ICollection<ChatMessage> messages, [EnumeratorCancellation] CancellationToken cancellationToken)
  {
    foreach (var update in new string[]{$"Response to {messages.Last(m => m.Role == ChatRole.User).Content}"})
    {
        yield return await Task.FromResult(update);
    }
  }
}

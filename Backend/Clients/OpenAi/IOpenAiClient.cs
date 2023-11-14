namespace Backend.Clients.OpenAi;

using Backend.Contracts;

public interface IOpenAiClient
{
  Task<ChatMessage?> GetChatCompletions(ICollection<ChatMessage> messages);
  IAsyncEnumerable<string> GetChatCompletionsAsyncEnumerable(ICollection<ChatMessage> messages, CancellationToken cancellationToken);
}

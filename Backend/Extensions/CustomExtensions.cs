namespace Backend.Extensions;

using Azure.AI.OpenAI;

public static class CustomExtensions
{
  public static async Task<T> Delay<T>(this Task<T> task, int timeoutInMs)
  {
    await Task.Delay(timeoutInMs);
    return await task;
  }

  public static Contracts.ChatRole ToChatRoleEnum(this ChatRole role)
    => role switch
    {
      var r when r == ChatRole.User => Contracts.ChatRole.User,
      var r when r == ChatRole.Assistant => Contracts.ChatRole.Assistant,
      var r when r == ChatRole.System => Contracts.ChatRole.System,
      var r when r == ChatRole.Function => Contracts.ChatRole.Function,
      var r when r == ChatRole.Tool => Contracts.ChatRole.Tool,
      _ => throw new NotImplementedException(),
    };

  public static ChatRole ToChatRole(this Contracts.ChatRole role)
    => role switch
    {
      Contracts.ChatRole.User => ChatRole.User,
      Contracts.ChatRole.Assistant => ChatRole.Assistant,
      Contracts.ChatRole.System => ChatRole.System,
      Contracts.ChatRole.Function => ChatRole.Function,
      Contracts.ChatRole.Tool => ChatRole.Tool,
      _ => throw new NotImplementedException(),
    };
}

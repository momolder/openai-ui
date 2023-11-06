namespace Backend.Contracts;

public class Conversation
{
  public required string Title { get; set; }
  public required List<ChatMessage> Messages { get; set; }
  public required string Guid { get; set; }
  public required bool IsFollowed { get; set; } = false;
  public required string UserId { get; set; } = string.Empty;
}

public record ChatMessage(ChatRole Role, string Content, string? Name = "");

public record UserInformation(string Id, string DisplayName);

public enum ChatRole
{
  Assistant,
  User,
  System,
  Function,
  Tool
}

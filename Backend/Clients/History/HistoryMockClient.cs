namespace Backend.Clients.History;

using Backend.Contracts;
using Backend.Extensions;

public class HistoryMockClient : IHistoryClient
{
  private static readonly object @lock = new();
  private static List<Conversation> conversations = [];

  public async Task<List<Conversation>> Load(string userId)
    => await Task.FromResult(conversations.Where(c => c.UserId == userId).ToList()).Delay(2000);

  public async Task<Conversation> Save(Conversation conversation)
  {
    var storedConversation = new Conversation
    {
      Guid = conversation.Guid,
      Title = conversation.Messages.First().Content,
      IsFollowed = true,
      Messages = conversation.Messages,
      UserId = conversation.UserId
    };

    lock (@lock)
    {
      conversations = [storedConversation, .. conversations];
    }

    return await Task.FromResult(storedConversation).Delay(1000);
  }

  public async Task<Conversation> Update(Conversation conversation)
  {
    lock (@lock)
    {
      var index = conversations.FindIndex(c => c.Guid == conversation.Guid);
      conversations[index] = conversation;
    }
    return await Task.FromResult(conversation).Delay(500);

  }

  public async Task<List<Conversation>> Remove(Conversation conversation)
  {
    lock (@lock)
    {
      conversations.RemoveAt(conversations.FindIndex(c => c.Guid == conversation.Guid));
    }
    return await Task.FromResult(conversations.Where(c => c.UserId == conversation.UserId).ToList());
  }

  public async Task Clear(string userId)
  {
    lock (@lock)
    {
      conversations = conversations.Where(c => c.UserId != userId).ToList();
    }
    await Task.CompletedTask;
  }
}

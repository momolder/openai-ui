namespace Backend.Clients.History;

using Backend.Contracts;

public interface IHistoryClient
{
  Task<Conversation> Save(Conversation conversation);
  Task<Conversation> Update(Conversation conversation);
  Task<List<Conversation>> Load(string userId);
  Task<List<Conversation>> Remove(Conversation conversation);
  Task Clear(string userId);
}

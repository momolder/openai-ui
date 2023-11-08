namespace Backend.Clients.History;

using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Contracts;
using Backend.Database;
using Microsoft.EntityFrameworkCore;

public class HistoryClient(ConversationContext context) : IHistoryClient, IDisposable
{
  private readonly ConversationContext context = context;

  public void Dispose() => context.Dispose();

  public async Task<List<Conversation>> Load(string userId)
    => await Task.FromResult(context.Conversations.Where(c => c.UserId == userId).AsNoTracking().ToList());

  public async Task<List<Conversation>> Remove(Conversation conversation)
  {
    var conv = context.Conversations.SingleOrDefault(c => c.UserId == conversation.UserId && c.Guid == conversation.Guid);
    if (conv != null)
    {
      context.Conversations.Remove(conv);
      await context.SaveChangesAsync();
    }
    return context.Conversations.Where(c => c.UserId == conversation.UserId).AsNoTracking().ToList();
  }

  public async Task<Conversation> Save(Conversation conversation)
  {
    conversation.IsFollowed = true;
    if (string.IsNullOrWhiteSpace(conversation.Title))
    {
      conversation.Title = conversation.Messages[0].Content;
    }
    var entity = context.Add(conversation);
    await context.SaveChangesAsync();
    return entity.Entity;
  }

  public async Task<Conversation> Update(Conversation conversation)
  {
    var conv = context.Conversations.Single(c => c.Guid == conversation.Guid);
    conv.Messages.AddRange(conversation.Messages.Skip(conv.Messages.Count));
    await context.SaveChangesAsync();
    return conv;
  }

  public async Task Clear(string userId)
  {
    context.RemoveRange(context.Conversations.Where(c => c.UserId == userId));
    await context.SaveChangesAsync();
  }
}

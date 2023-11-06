namespace Backend.Database;

using Backend.Contracts;
using Backend.Extensions;
using Microsoft.EntityFrameworkCore;

public class ConversationContext(DbContextOptions<ConversationContext> options, IConfiguration configuration) : DbContext(options)
{
  private readonly DatabaseConfiguration configuration = configuration.GetTyped<DatabaseConfiguration>();

  public DbSet<Conversation> Conversations { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
    => modelBuilder.Entity<Conversation>().ToContainer(nameof(Conversations)).HasKey(c => c.Guid);
}

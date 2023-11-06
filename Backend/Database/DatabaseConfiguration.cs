namespace Backend.Database;

public class DatabaseConfiguration
{
  public string? DatabaseName { get; set; }
  public string? AccountEndpoint { get; set; }
  public string? AccountKey { get; set; }
  public bool Rebuild { get; set; } = false;
}

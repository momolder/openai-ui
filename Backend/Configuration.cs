namespace Backend;

public record BackendConfiguration
{
  public bool UseMock { get; set; } = false;
  public bool UseHistory { get; set; } = false;
  public string Version { get; set; } = "dev";
}

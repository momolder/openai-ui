namespace Backend.Clients.OpenAi;

public record OpenAiConfiguration
{
  public string? Key { get; set; }
  public string? Endpoint { get; set; }
  public string? Deployment { get; set; }

  public int MaxTokens { get; set; } = 60;
  public float Temperature { get; set; } = 0.3f;
  public float FrequencyPenalty { get; set; } = 0.5f;
  public float PresencePenalty { get; set; } = 0.0f;
  public float NucleusSamplingFactor { get; set; } = 1; // Top P
  public string StopSequences { get; set; } = "You:";
}

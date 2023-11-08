namespace Backend.Clients.OpenAi;

public record OpenAiConfiguration
{
  public string? Key { get; set; }
  public string? Endpoint { get; set; }
  public string? Deployment { get; set; }

  public int MaxTokens { get; set; } = 800;
  public float Temperature { get; set; } = 0.7f;
  public float FrequencyPenalty { get; set; } = 0.0f;
  public float PresencePenalty { get; set; } = 0.0f;
  public float NucleusSamplingFactor { get; set; } = 0.95f; // Top P
  public string StopSequences { get; set; } = "<|im_end|>";
}

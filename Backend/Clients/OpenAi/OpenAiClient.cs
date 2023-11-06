namespace Backend.Clients.OpenAi;

using AutoMapper;
using Azure;
using Azure.AI.OpenAI;
using Backend.Extensions;

public class OpenAiClient : IOpenAiClient
{
  private readonly OpenAIClient client;

  private ChatCompletionsOptions chatCompletionOptions(params ChatMessage[] chatMessages)
    => new(chatMessages)
    {
      MaxTokens = configuration.MaxTokens,
      Temperature = configuration.Temperature,
      FrequencyPenalty = configuration.FrequencyPenalty,
      PresencePenalty = configuration.PresencePenalty,
      NucleusSamplingFactor = configuration.NucleusSamplingFactor, // Top P
      StopSequences = { configuration.StopSequences }
    };

  private readonly ILogger<OpenAIClient> logger;
  private readonly IMapper mapper;
  private readonly OpenAiConfiguration configuration;
  public OpenAiClient(ILogger<OpenAIClient> logger, IMapper mapper, IConfiguration configuration)
  {
    this.configuration = configuration.GetTyped<OpenAiConfiguration>();
    client = new OpenAIClient(new Uri(this.configuration.Endpoint.NotNull().NotWhiteSpace()), new AzureKeyCredential(this.configuration.Key.NotNull().NotWhiteSpace()));
    this.logger = logger;
    this.mapper = mapper;
  }

  public async Task<Contracts.ChatMessage?> GetChatCompletions(ICollection<Contracts.ChatMessage> messages)
  {
    var oaiMessages = mapper.Map<ChatMessage[]>(messages);
    var completionsResponse = await client.GetChatCompletionsAsync(configuration.Deployment.NotNull().NotWhiteSpace(), chatCompletionOptions(oaiMessages));
    var completion = completionsResponse?.Value.Choices[0].Message;

    return mapper.Map<Contracts.ChatMessage>(completion);
  }
}

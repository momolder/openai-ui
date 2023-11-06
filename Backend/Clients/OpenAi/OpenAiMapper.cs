namespace Backend.Clients.OpenAi;

using AutoMapper;
using Azure.AI.OpenAI;
using Backend.Extensions;

public class OpenAiMapper : Profile
{
  public OpenAiMapper()
  {
    MapChatMessage();
    MapChatRole();
  }

  private void MapChatMessage()
    => CreateMap<ChatMessage, Contracts.ChatMessage>().ReverseMap();

  private void MapChatRole()
  {
    CreateMap<ChatRole, Contracts.ChatRole>().ConstructUsing(src => src.ToChatRoleEnum());
    CreateMap<Contracts.ChatRole, ChatRole>().ConstructUsing(src => src.ToChatRole());
  }
}

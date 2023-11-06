namespace Backend;

using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Backend.Clients.Authentication;
using Backend.Clients.History;
using Backend.Clients.OpenAi;
using Backend.Database;
using Backend.Middleware;
using Microsoft.AspNetCore.Http.Json;

internal class Program
{
  private static void Main(string[] args)
  {
    var builder = WebApplication.CreateBuilder(args);

    builder.Services.Configure<JsonOptions>(options =>
    {
      options.SerializerOptions.PropertyNameCaseInsensitive = true;
      options.SerializerOptions.WriteIndented = true;
      options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
      options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
      options.SerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });

    builder.Services.Configure<Microsoft.AspNetCore.Mvc.JsonOptions>(options =>
    {
      options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
      options.JsonSerializerOptions.WriteIndented = true;
      options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
      options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
      options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });

    builder.Services.ConfigureHttpJsonOptions(options =>
    {
      options.SerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });

    builder.Services.AddControllers();

    builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

    builder.Services.AddEndpointsApiExplorer();

    builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);

    builder.Services.AddOpenApiDocument("OpenAI-WebApp", 1);

    builder.Services.AddDatabase(builder.Configuration);

    builder.Services.AddOpenAiClient(builder.Configuration);

    builder.Services.AddHistoryClient(builder.Configuration);

    builder.Services.AddSpaStaticFiles(configuration => configuration.RootPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot"));

    builder.Services.AddAuthenticationClient(builder.Configuration);

    var app = builder.Build();

    app.UseOpenApiDocument();

    app.UseDababase(builder.Configuration);

    app.UseSpaStaticFiles();

    app.UseAuthentication();

    app.UseRouting();

    app.MapControllers();

    app.UseSpa(c => { });

    app.Run();
  }
}

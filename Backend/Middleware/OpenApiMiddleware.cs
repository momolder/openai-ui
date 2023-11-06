namespace Backend.Middleware;

public static class OpenApiMiddleware
{
  public static IServiceCollection AddOpenApiDocument(this IServiceCollection services, string title, int version)
  {
    services.AddOpenApiDocument((options, provider) =>
    {
      options.Title = title;
      options.Version = $"v{version}";
    });

    return services;
  }

  public static IApplicationBuilder UseOpenApiDocument(this IApplicationBuilder builder)
    => builder.UseOpenApi().UseSwaggerUi3();
}

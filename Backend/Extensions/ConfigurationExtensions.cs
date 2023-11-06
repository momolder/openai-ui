namespace Backend.Extensions;

using System.Text.Json;
using System.Text.Json.Serialization;

public static class ConfigurationExtensions
{
  /// <summary>
  /// Reads and parses a section of AppSettings and throws 
  /// </summary>
  /// <typeparam name="T">the type to deserialize into</typeparam>
  /// <param name="configuration">the root configuration object</param>
  /// <returns>the typed config object</returns>
  public static T GetTyped<T>(this IConfiguration configuration) where T : class, new()
    => configuration.GetSection(typeof(T).Name).Get<T>() ?? throw new ArgumentException(ConfigMissingMessage<T>());

  private static string ConfigMissingMessage<T>() where T : new()
  {
    var emptyT = new T();
    var options = new JsonSerializerOptions
    {
      WriteIndented = true,
      DefaultIgnoreCondition = JsonIgnoreCondition.Never
    };
    options.Converters.Add(new JsonStringEnumConverter());

    return $"{typeof(T).Name} is not configured, extend AppSettings with:\n{typeof(T).Name}:\n{JsonSerializer.Serialize(emptyT, options)}";
  }
}

namespace Backend.Extensions;

public static class ArgumentExtensions
{
  public static T NotNull<T>(this T? argument) where T : class => argument ?? throw new ArgumentException($"{nameof(argument)} cannot be null.");
  public static IEnumerable<T> NotEmpty<T>(this IEnumerable<T> argument) => argument.Any() ? argument : throw new ArgumentException($"{nameof(argument)} cannot be empty.");
  public static string NotEmpty(this string argument) => string.IsNullOrEmpty(argument) ? throw new ArgumentException($"{nameof(argument)} cannot be empty.") : argument;
  public static string NotWhiteSpace(this string argument) => string.IsNullOrWhiteSpace(argument) ? throw new ArgumentException($"{nameof(argument)} cannot be empty or consist only of white-space characters.") : argument;
}

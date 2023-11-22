
export function isNullOrWhitespace(input: string | null | undefined): boolean {
  return input == null ? true : input.trim() === '';
}

export function chunkString(input: string, chunkSize: number): string[] {

  let result = [];
  while(input.length > 0) {
    let chunk = input.slice(0, input.length > chunkSize ? chunkSize : input.length);
    input = input.slice(chunkSize);
    result.push(chunk);
  }
  return result;
}

import { toast } from '@zerodevx/svelte-toast';

export function ToastErrors(error: any): undefined {
  console.error(error);
  toast.push(
    { msg: error.message },
    {
      dismissable: true,
      duration: 5000
    }
  );
}

export function isNullOrWhitespace(input: string | null | undefined): boolean {
  return input == null ? true : input.trim() === '';
}

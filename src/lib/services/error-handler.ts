import { toast } from '@zerodevx/svelte-toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ToastErrors(error: any): undefined {
  console.error(error);
  toast.push(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    { msg: error.message },
    {
      dismissable: true,
      duration: 5000
    }
  );
}

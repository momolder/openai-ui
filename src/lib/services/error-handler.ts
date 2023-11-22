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

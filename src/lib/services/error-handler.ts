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

export function ToastErrorsPipe(response: Response): Response {
  if (!response.ok) {
    console.error(response.statusText);
    toast.push(
      { msg: response.statusText },
      {
        dismissable: true,
        duration: 5000
      }
    );
  }
  return response;
}

export async function ToastErrorsJsonPipe(response: Response): Promise<unknown> {
  const json = (await response.json()) as string;
  if (!response.ok) {
    console.error(json);
    toast.push(
      { msg: response.statusText },
      {
        dismissable: true,
        duration: 5000
      }
    );
  }
  return json;
}

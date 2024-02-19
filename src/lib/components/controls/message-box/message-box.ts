import { get, writable } from 'svelte/store';
import info from '$lib/assets/info.svg';
import warning from '$lib/assets/warning.svg';
import error from '$lib/assets/error.svg';

export const MessageBoxStore = writable<{
  showMessage: boolean;
  icon: string;
  title: string;
  message: string;
  ok: boolean;
  okLabel: string;
  cancelLabel: string;
  slot?: string;
  input?: input;
}>({
  showMessage: false,
  icon: '',
  title: '',
  message: '',
  ok: false,
  okLabel: 'Ok',
  cancelLabel: 'Cancel'
});

export interface input {
  type: 'text';
  placeholder: string;
  value?: string;
}

export async function showMessageBox(
  type: 'info' | 'warning' | 'error',
  message: string,
  title?: string,
  okLabel?: string,
  cancelLabel?: string,
  customIcon?: string,
  input?: input
): Promise<boolean> {
  const icon = type === 'info' ? info : type === 'warning' ? warning : error;
  MessageBoxStore.set({
    showMessage: true,
    icon: customIcon ?? icon,
    title: title ?? '',
    message: message,
    ok: false,
    okLabel: okLabel ?? 'Ok',
    cancelLabel: cancelLabel ?? 'Cancel',
    input: input
  });

  let dialogOpen = false;
  const unsubscriber = MessageBoxStore.subscribe((m) => (dialogOpen = m.showMessage));

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (dialogOpen) {
    await new Promise((f) => setTimeout(f, 500));
  }

  unsubscriber.call(MessageBoxStore);
  return get(MessageBoxStore).ok;
}

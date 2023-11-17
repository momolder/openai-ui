import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import type { State, UserInformation } from '$lib/models/Contracts';
import { ToastErrors, isNullOrWhitespace } from './error-handler';
import { StateStore, UserStore } from './state-management';

class StateService {
  public async loadState(): Promise<void> {
    if (browser) {
      const state = localStorage.state as string;
      StateStore.set(JSON.parse(isNullOrWhitespace(state) ? '{}' : state) as State);
      StateStore.update((u) => {
        u.useHistory = env.PUBLIC_App_UseHistory === 'true';
        u.useMock = env.PUBLIC_App_UseMock === 'true';
        u.autosave = u.useHistory && u.autosave;
        u.version = env.PUBLIC_App_Version;
        return u;
      });
      StateStore.subscribe((s) => (localStorage.state = JSON.stringify(s)));
    }
  }

  public async loadUser(): Promise<void> {
      const r = await fetch(`/user`, { method: 'GET' });
      await r
        .json()
        .then((user) => {
          UserStore.set(user as UserInformation);
        })
        .catch(ToastErrors);
  }
}

const stateService: StateService = new StateService();
export default stateService;

import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { isNullOrWhitespace, type SvelteFetch } from '$lib/helper';
import type { ClientPrincipal, State, UserInformation } from '$lib/models/Contracts';
import { ToastErrors, ToastErrorsJsonPipe } from './error-handler';
import { StateStore, UserStore } from './state-management';

class StateService {
  public loadState(): void {
    if (browser) {
      const state = localStorage.state as string;
      StateStore.set(JSON.parse(isNullOrWhitespace(state) ? '{}' : state) as State);
      StateStore.update((u) => {
        u.useHistory = env.PUBLIC_App_UseHistory === 'true';
        u.useMock = env.PUBLIC_App_UseMock === 'true';
        if (!state) {
          u.autosave = u.useHistory && env.PUBLIC_App_Autosave === 'true';
        }
        u.autosave = u.useHistory && u.autosave;
        u.version = env.PUBLIC_App_Version;
        u.sidebarSlot = '';
        if (env.PUBLIC_OpenAi_Deployments.length <= 0) u.deployment = '';
        else if (!u.deployment) u.deployment = env.PUBLIC_OpenAi_Deployments.split('|')[0];
        else if (!env.PUBLIC_OpenAi_Deployments.includes(u.deployment))
          u.deployment = env.PUBLIC_OpenAi_Deployments.split('|')[0];
        return u;
      });
      StateStore.subscribe((s) => (localStorage.state = JSON.stringify(s)));
    }
  }

  public async loadUser(svelteFetch: SvelteFetch): Promise<void> {
    return await svelteFetch(`/user`, { method: 'GET' })
      .then(ToastErrorsJsonPipe)
      .then((user) => {
        UserStore.set(user as UserInformation);
      })
      .catch(ToastErrors);
  }

  public async getUserinfo(): Promise<ClientPrincipal | undefined> {
    return await fetch(`/user/validate`, { method: 'GET' })
      .then(ToastErrorsJsonPipe)
      .then((c) => c as ClientPrincipal)
      .catch(ToastErrors);
  }

  public async validateUser(svelteFetch: SvelteFetch): Promise<boolean> {
    let isValid = false;
    await svelteFetch(`/user/validate`, { method: 'GET' })
      .then((ok) => {
        isValid = ok.status === 200;
      })
      .catch(ToastErrors);
    return isValid;
  }

  public useDocumentSearch(): boolean {
    return env.PUBLIC_App_UseDocumentSearch === 'true';
  }
}

const stateService: StateService = new StateService();
export default stateService;

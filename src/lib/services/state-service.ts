import { env } from '$env/dynamic/public';
import { availableDeployments, isNullOrWhitespace, type SvelteFetch } from '$lib/helper';
import { ChatMode, type ClientPrincipal, type State, type UserInformation } from '$lib/models/Contracts';
import { ToastErrors, ToastErrorsJsonPipe } from './error-handler';
import { StateStore, UserStore } from './state-management';

class StateService {
  public loadState(): void {
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
      const deployments = availableDeployments();
      if (!u.deployment) u.deployment = deployments[0];
      else if (!env.PUBLIC_OpenAi_Deployments.includes(u.deployment)) u.deployment = deployments[0];
      if (!u.chatMode) u.chatMode = ChatMode.Balanced;
      return u;
    });
    StateStore.subscribe((s) => (localStorage.state = JSON.stringify(s)));
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
    return (await svelteFetch(`/user/validate`, { method: 'GET' })).status === 200;
  }

  public useDocumentSearch(): boolean {
    return env.PUBLIC_App_UseDocumentSearch === 'true';
  }
}

const stateService: StateService = new StateService();
export default stateService;

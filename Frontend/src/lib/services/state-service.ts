import type { State } from '$lib/models/state';
import {
  type BackendConfiguration,
  SettingsClient,
  AuthenticationClient,
  type UserInformation
} from './backend-api';
import { ToastErrors, isNullOrWhitespace } from './error-handler';
import { StateStore, UserStore } from './state-management';

class StateService {
  constructor(
    private client = new SettingsClient(window.location.origin),
    private authClient = new AuthenticationClient(window.location.origin)
  ) {}

  public async loadState(): Promise<void> {
    const state = localStorage.state as string;
    StateStore.set(JSON.parse(isNullOrWhitespace(state) ? '{}' : state) as State);
    await this.client
      .getSettings()
      .then((c) => {
        StateStore.update((u) => {
          u.useHistory = c.useHistory;
          u.useMock = c.useMock;
          u.autosave = c.useHistory && u.autosave
          return u;
        });
      })
      .catch(ToastErrors);
    StateStore.subscribe((s) => (localStorage.state = JSON.stringify(s)));
  }

  public async getConfiguration(): Promise<BackendConfiguration | undefined> {
    return await this.client.getSettings().catch(ToastErrors);
  }

  public async loadUser(): Promise<void> {
    const userJson = localStorage.user as string;
    let user = JSON.parse(isNullOrWhitespace(userJson) ? '{}' : userJson) as UserInformation;
    if (isNullOrWhitespace(user.id) || !(await this.authClient.validateUser(user))) {
      user = await this.authClient.getUser();
      localStorage.setItem('user', JSON.stringify(user));
    }
    UserStore.set(user);
  }
}

const stateService: StateService = new StateService();
export default stateService;

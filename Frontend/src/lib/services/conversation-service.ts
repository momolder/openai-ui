import { get } from 'svelte/store';
import { ConversationClient, ChatRole } from './backend-api';
import { ConversationStore, StateStore, UserStore } from './state-management';
import { v4 as uuid } from 'uuid';
import historyService from './history-service';
import { ToastErrors } from './error-handler';

class ConversationService {
  constructor(private client = new ConversationClient(window.location.origin)) {}

  public async getResponse(userPrompt: string) {
    const conversation = get(ConversationStore);
    const guid = conversation.guid;
    const message = { content: userPrompt, role: ChatRole.User, name: 'prompt' };
    ConversationStore.update((u) => {
      u.messages.push(message);
      return u;
    });
    await this.client
      .getResponse(conversation)
      .then((message) => {
        if (conversation.guid === guid)
          ConversationStore.update((u) => {
            u.messages.push(message);
            return u;
          });
      })
      .catch(ToastErrors);

    if (!conversation.isFollowed && get(StateStore).autosave) {
      await historyService.follow();
    }
  }

  public clear() {
    ConversationStore.set({
      guid: uuid().toString(),
      messages: [],
      title: '',
      isFollowed: false,
      userId: get(UserStore).id
    });
  }
}

const conversationService: ConversationService = new ConversationService();
export default conversationService;

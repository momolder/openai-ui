import { get } from 'svelte/store';
import { ChatRole } from './backend-api';
import { ConversationStore, StateStore, UserStore } from './state-management';
import { v4 as uuid } from 'uuid';
import historyService from './history-service';
import { ToastErrors } from './error-handler';

class ConversationService {
  public async getResponse(userPrompt: string) {
    const conversation = get(ConversationStore);
    const message = { content: userPrompt, role: ChatRole.User, name: 'prompt' };
    const response = { content: '', role: ChatRole.Assistant, name: 'response' };
    ConversationStore.update((u) => {
      u.messages.push(message);
      u.messages.push(response);
      return u;
    });

    await fetch(`${window.location.origin}/api/conversation/stream`, {
      method: 'POST',
      body: JSON.stringify(conversation),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain'
      }
    }).then(async (c) => {
      console.log()
      const reader = c.body?.getReader();
      if (!reader) {
        throw new Error('Failed to read response');
      }
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;
        const part = Array.from(decoder.decode(value).matchAll(/"(.*?)"/g)).map(m => m[1]).join("");
        ConversationStore.update((u) => {
          const message = u.messages.pop()!;
          message.content += part;
          u.messages.push(message);
          return u;
        });
      }
      reader.releaseLock();
    }).catch(ToastErrors);

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

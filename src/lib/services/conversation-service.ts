import { get } from 'svelte/store';
import { ConversationStore, HistoryStore, StateStore, UserStore } from './state-management';
import { v4 as uuid } from 'uuid';
import { ToastErrors } from './error-handler';
import { ChatRole, type Conversation } from '$lib/models/Contracts';

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
    await fetch(`/conversation`, {
      method: 'POST',
      body: JSON.stringify(conversation),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'plain/text'
      }
    })
      .then(async (c) => {
        const reader = c.body?.pipeThrough(new TextDecoderStream()).getReader();
        if (!reader) {
          throw new Error('Failed to read response');
        }
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (!value) continue;
          ConversationStore.update((u) => {
            const message = u.messages.pop()!;
            message.content += value;
            u.messages.push(message);
            return u;
          });
        }
        reader.releaseLock();
      })
      .catch(ToastErrors);
    if (!conversation.isFollowed && get(StateStore).autosave) {
      await this.follow();
    } else if (conversation.isFollowed) {
      await fetch(`/history`, {
        method: 'PUT',
        body: JSON.stringify(get(ConversationStore))
      });
    }
  }

  public load(entry: Conversation): void {
    ConversationStore.set(entry);
  }

  public clear() {
    ConversationStore.set({
      id: uuid().toString(),
      messages: [],
      title: '',
      isFollowed: false,
      userId: get(UserStore)?.id ?? '1'
    });
  }

  public async loadHistory(): Promise<void> {
    await (await fetch(`/history/user/${get(UserStore).id}`))
      .json()
      .then(HistoryStore.set)
      .catch(ToastErrors);
  }

  public async clearHistory(): Promise<void> {
    await fetch(`/history/user/${get(UserStore).id}`, { method: 'DELETE' }).catch(ToastErrors);
    ConversationStore.update((c) => {
      c.isFollowed = false;
      return c;
    });
    HistoryStore.set([]);
  }

  public async follow(): Promise<void> {
    const currentConversation = get(ConversationStore);
    currentConversation.isFollowed = true;
    currentConversation.title = currentConversation.messages.at(0)?.content ?? 'undefined';
    const addedConversation = await (
      await fetch(`/history`, { method: 'POST', body: JSON.stringify(currentConversation) })
    )
      .json()
      .catch(ToastErrors);
    if (addedConversation) {
      HistoryStore.update((u) => {
        u = [addedConversation, ...u];
        return u;
      });
      ConversationStore.update((u) => {
        u.isFollowed = addedConversation.isFollowed;
        u.title = addedConversation.title;
        return u;
      });
    }
  }

  public async unfollow(entry: Conversation) {
    await fetch(`/history`, { method: 'DELETE', body: JSON.stringify(entry) }).catch(ToastErrors);
    await this.loadHistory();
    ConversationStore.update((u) => {
      if (u.id === entry.id) u.isFollowed = false;
      return u;
    });
  }
}

const conversationService: ConversationService = new ConversationService();
export default conversationService;

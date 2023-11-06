import type { Unsubscriber } from 'svelte/motion';
import { HistoryClient, type Conversation } from './backend-api';
import { ConversationStore, HistoryStore, UserStore } from './state-management';
import { get } from 'svelte/store';
import { ToastErrors } from './error-handler';

class HistoryService {
  private unsuber: { guid: string; unsubscriber: Unsubscriber }[] = [];

  constructor(private client = new HistoryClient(window.location.origin)) {}

  public async loadHistory(): Promise<void> {
    return await this.client.getConversations(get(UserStore).id).then(HistoryStore.set).catch(ToastErrors);
  }

  public async follow(): Promise<void> {
    const currentConversation = get(ConversationStore);
    const addedConversation = await this.client.addConversation(currentConversation).catch(ToastErrors);
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
      this.track(addedConversation.guid);
    }
  }

  public async unfollow(entry: Conversation) {
    this.untrack(entry.guid);

    const conversations = await this.client.deleteConversation(entry).catch(ToastErrors);

    if (conversations) {
      HistoryStore.set(conversations);

      ConversationStore.update((u) => {
        if (u.guid === entry.guid) u.isFollowed = false;
        return u;
      });
    }
  }

  public load(entry: Conversation): void {
    ConversationStore.set(entry);
    this.track(entry.guid);
  }

  public async clear(): Promise<void> {
    await this.client.clearConversations(get(UserStore).id);
    this.untrack(get(ConversationStore).guid);
    ConversationStore.update((c) => {
      c.isFollowed = false;
      return c;
    });
    HistoryStore.set([]);
  }

  private track(guid: string): void {
    if (!this.unsuber.some((g) => g.guid === guid)) {
      const unsub = ConversationStore.subscribe((c) => {
        if (c.guid === guid) this.client.updateConversation(c).catch(ToastErrors);
      });
      this.unsuber.push({ guid: guid, unsubscriber: unsub });
    }
  }

  private untrack(guid: string) {
    if (this.unsuber.some((u) => u.guid === guid)) {
      const index = this.unsuber.findIndex((g) => g.guid === guid);
      this.unsuber[index].unsubscriber();
      this.unsuber = this.unsuber.splice(index, 1);
    }
  }
}

const historyService: HistoryService = new HistoryService();
export default historyService;

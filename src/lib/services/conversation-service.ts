import { get } from 'svelte/store';
import { ConversationStore, HistoryStore, IsStreaming, StateStore, UserStore } from './state-management';
import { ToastErrors } from './error-handler';
import { ChatRole, type ChatMessage, type Conversation } from '$lib/models/Contracts';
import { chunkString, type SvelteFetch } from '$lib/helper';

class ConversationService {
  private doCancel = false;
  public cancel() {
    this.doCancel = true;
  }

  public async respondTo(userPrompt: string) {
    IsStreaming.set(true);
    const conversation = get(ConversationStore);
    const message = { content: userPrompt, role: ChatRole.User, name: 'prompt', context: undefined };
    const response = { content: '', role: ChatRole.Assistant, name: 'response', context: undefined };
    ConversationStore.update((u) => {
      u.date = new Date();
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
        let quitReading = false;
        while (!quitReading && !this.doCancel) {
          const { done, value } = await reader.read();
          quitReading = done;
          if (quitReading || !value) continue;
          await this.updateStore(value);
        }
        this.workaroundMarkdownIssues();
        reader.releaseLock();
        if (this.doCancel) {
          this.doCancel = false;
        }
      })
      .catch(ToastErrors)
      .finally(() => {
        IsStreaming.set(false);
      });

    if (!conversation.isFollowed && get(StateStore).autosave) {
      await this.follow();
    } else if (conversation.isFollowed) {
      await fetch(`/history`, {
        method: 'PUT',
        body: JSON.stringify(get(ConversationStore))
      });
      await this.loadHistory(fetch);
    }
  }

  public async regenerateMessage(message: ChatMessage) {
    const conversation = get(ConversationStore);
    const index = conversation.messages.indexOf(message);
    if (index > 0) {
      conversation.messages.splice(index);
      const lastPromt = conversation.messages.pop();
      if (lastPromt && lastPromt.role === ChatRole.User) await this.respondTo(lastPromt.content);
    }
  }

  public newConversation() {
    ConversationStore.set({
      id: crypto.randomUUID(),
      messages: [],
      citations: [],
      title: '',
      isFollowed: false,
      userId: get(UserStore).id,
      date: new Date(),
      useDocumentSearch: true
    });
  }

  public loadConversation(entry: Conversation): void {
    ConversationStore.set(entry);
  }

  public async loadHistory(svelteFetch: SvelteFetch): Promise<void> {
    await (await svelteFetch(`/history/user/me`)).json().then(HistoryStore.set).catch(ToastErrors);
  }

  public async clearHistory(): Promise<void> {
    await fetch(`/history/user/me`, { method: 'DELETE' }).catch(ToastErrors);
    ConversationStore.update((c) => {
      c.isFollowed = false;
      return c;
    });
    HistoryStore.set([]);
  }

  public async follow(): Promise<void> {
    const currentConversation = get(ConversationStore);
    currentConversation.isFollowed = true;
    currentConversation.title =
      currentConversation.messages.filter((m) => m.role === ChatRole.User).at(0)?.content ?? 'undefined';
    const addedConversation = await fetch(`/history`, {
      method: 'POST',
      body: JSON.stringify(currentConversation)
    })
      .then(async (x) => (await x.json()) as Conversation)
      .catch(ToastErrors);

    if (addedConversation) {
      await this.loadHistory(fetch);
      ConversationStore.update((u) => {
        u.isFollowed = addedConversation.isFollowed;
        u.title = addedConversation.title;
        return u;
      });
    }
  }

  public async unfollow(entry: Conversation) {
    await fetch(`/history`, { method: 'DELETE', body: JSON.stringify(entry) }).catch(ToastErrors);
    await this.loadHistory(fetch);
    ConversationStore.update((u) => {
      if (u.id === entry.id) u.isFollowed = false;
      return u;
    });
  }

  private async updateStore(value: string) {
    const conv = get(ConversationStore);
    const jsonBlocks = value.split(/(?<=\})\s*(?=\{)/);
    for (const json of jsonBlocks) {
      try {
        const message = JSON.parse(json) as ChatMessage;
        if (message.context && message.context.messages.length > 0) {
          conv.messages[conv.messages.length - 1].context = message.context;
          ConversationStore.set(conv);
        }
        if (message.content) {
          for (const sequence of chunkString(message.content, 4)) {
            await new Promise((f) => setTimeout(f, 10));
            conv.messages[conv.messages.length - 1].content += sequence;
            ConversationStore.set(conv);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  private workaroundMarkdownIssues() {
    // Workaround for streaming issues in markdown
    const conv = get(ConversationStore);
    const clone = JSON.parse(JSON.stringify(conv)) as Conversation;
    conv.messages[conv.messages.length - 1].content = '';
    ConversationStore.set(conv);
    ConversationStore.set(clone);
  }
}

const conversationService: ConversationService = new ConversationService();
export default conversationService;

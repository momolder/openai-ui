import { get } from 'svelte/store';
import { ConversationStore, HistoryStore, StateStore, UserStore } from './state-management';
import { v4 as uuid } from 'uuid';
import { ToastErrors } from './error-handler';
import { ChatRole, type ChatMessage, type Conversation, type ToolMessage } from '$lib/models/Contracts';
import { chunkString, type SvelteFetch } from '$lib/helper';

class ConversationService {
  public async getResponse(userPrompt: string) {
    const conversation = get(ConversationStore);
    const message = { content: userPrompt, role: ChatRole.User, name: 'prompt', context: undefined };
    const response = { content: '', role: ChatRole.Assistant, name: 'response', context: undefined };
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
        let quitReading = false;
        while (!quitReading) {
          const { done, value } = await reader.read();
          quitReading = done;
          if (quitReading || !value) continue;
          await this.updateStore(value);
        }
        await this.workaroundMarkdownIssues();
        this.updateCitations();
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

  private async updateStore(value: string) {
    const conv = get(ConversationStore);
    const jsonBlocks = value.split(/(?<=\})\s*(?=\{)/);
    for (const json of jsonBlocks) {
      const message = JSON.parse(json) as ChatMessage;
      if (message.context && message.context.messages.length > 0) {
        const citations = message.context.messages
          .filter((m) => m.role === ChatRole.Tool)
          .flatMap((m) => JSON.parse(m.content) as ToolMessage[])
          .flatMap((m) => m.citations);
        // TODO: Do citations need to be stored per message or globally?
        citations
          .reverse()
          .forEach((c) => conv.citations.push({ ...c, id: (conv.citations.at(-1)?.id ?? -1) + 1 }));
        ConversationStore.set(conv);
      }
      if (message.content) {
        for (const sequence of chunkString(message.content, 4)) {
          await new Promise((f) => setTimeout(f, 10));
          conv.messages[conv.messages.length - 1].content += sequence;
          ConversationStore.set(conv);
        }
      }
    }
  }

  private async workaroundMarkdownIssues() {
    // Workaround for streaming issues in markdown
    const conv = get(ConversationStore);
    const clone = JSON.parse(JSON.stringify(conv)) as Conversation;
    conv.messages[conv.messages.length - 1].content = '';
    ConversationStore.set(conv);
    await new Promise((f) => setTimeout(f, 10));
    ConversationStore.set(clone);
  }

  private updateCitations() {
    const conv = get(ConversationStore);
    const lastResponse = conv.messages.at(-1);
    if (!lastResponse) return;
    const matches = lastResponse.content.matchAll(/\[doc(\d+)\]/g);
    for (const match of matches) {
      const docNum = match.at(1) ?? 0;
      // const base64Url = conv.citations.at(0)?.url ?? "";
      lastResponse.content = lastResponse.content.replace(
        `doc${docNum}`,
        `doc${conv.citations.at(-docNum)?.id}`
      );
    }
    ConversationStore.set(conv);
  }

  public async regenerate(message: ChatMessage) {
    const conversation = get(ConversationStore);
    const index = conversation.messages.indexOf(message);
    if (index > 0) {
      conversation.messages.splice(index);
      const lastPromt = conversation.messages.pop();
      if (lastPromt && lastPromt.role === ChatRole.User) await this.getResponse(lastPromt.content);
    }
  }

  public load(entry: Conversation): void {
    ConversationStore.set(entry);
  }

  public new() {
    ConversationStore.set({
      id: uuid().toString(),
      messages: [],
      citations: [],
      title: '',
      isFollowed: false,
      userId: get(UserStore).id,
      date: new Date()
    });
  }

  public async loadHistory(svelteFetch: SvelteFetch): Promise<void> {
    await (await svelteFetch(`/history/user/${get(UserStore).id}`))
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
    currentConversation.title =
      currentConversation.messages.filter((m) => m.role === ChatRole.User).at(0)?.content ?? 'undefined';
    const addedConversation = await fetch(`/history`, {
      method: 'POST',
      body: JSON.stringify(currentConversation)
    })
      .then(async (x) => (await x.json()) as Conversation)
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
    await this.loadHistory(fetch);
    ConversationStore.update((u) => {
      if (u.id === entry.id) u.isFollowed = false;
      return u;
    });
  }
}

const conversationService: ConversationService = new ConversationService();
export default conversationService;

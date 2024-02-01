import type { RequestEvent } from '@sveltejs/kit';
import { chunkString } from '$lib/helper';
import { ChatRole, type Conversation } from '$lib/models/Contracts';
import type { ChatRequestMessage } from '@azure/openai';

export async function POST({ request }: RequestEvent) {
  const conversation = (await request.json()) as Conversation;
  const content = `*${conversation.messages.at(-2)?.content}* was your request and this is my answer.`;
  const responseString = JSON.stringify({
    role: ChatRole.Assistant,
    content: content,
    name: 'response'
  } as ChatRequestMessage);
  const stream = new ReadableStream({
    start(controller) {
      try {
        for (const chunk of chunkString(responseString, 4)) {
          if (chunk) {
            controller.enqueue(chunk);
          }
        }
      } catch (e) {
        console.error(e);
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'content-type': 'plain/text'
    }
  });
}

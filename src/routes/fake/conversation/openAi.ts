import { chunkString } from '$lib/helper';
import { ChatRole } from '$lib/models/Contracts';
import type { ChatRequestMessage } from '@azure/openai';

export function streamResponse(content: string) {
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

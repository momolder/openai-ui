import type { Conversation } from '$lib/models/Contracts';
import { AzureKeyCredential, OpenAIClient } from '@azure/openai';
import type { RequestEvent } from './$types';
import { env } from '$env/dynamic/private';

export async function POST({ request }: RequestEvent) {
  const client = new OpenAIClient(env.OpenAi_Endpoint, new AzureKeyCredential(env.OpenAi_Key));
  const conversation = (await request.json()) as Conversation;
  const mappedMessages = conversation.messages.map((m) => {
    return {
      content: m.content,
      role: m.role,
      name: m.name
    };
  });
  const chatStream = client.listChatCompletions(env.OpenAi_Deployment, mappedMessages);
  const stream = new ReadableStream({
    async start(controller) {
      for await (const update of chatStream) {
        for (const choice of update.choices) {
          const delta = choice.delta?.content;
          if (delta !== undefined) {
            controller.enqueue(delta);
          }
        }
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

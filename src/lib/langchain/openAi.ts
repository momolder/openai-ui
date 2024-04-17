import { env } from '$env/dynamic/private';
import { ChatMode, ChatRole, type Conversation } from '$lib/models/Contracts';
import { AzureChatOpenAI } from '@langchain/azure-openai';
import { AIMessage, HumanMessage, BaseMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  AzureAISearchVectorStore,
  AzureAISearchQueryType
} from '@langchain/community/vectorstores/azure_aisearch';
import type { Document } from '@langchain/core/documents';
import { ConsoleCallbackHandler } from '@langchain/core/tracers/console';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { type ChainInput, chatModeTemplates, rephraseTemplate, promptTemplate } from './templates';

export async function response(conversation: Conversation, chatMode: ChatMode, deployment: string) {
  const mappedMessages = mapMessages(conversation); // map messages to AIMessage and HumanMessage
  mappedMessages.pop(); // remove the placeholder for the response
  const question = mappedMessages.pop(); // remove the question

  const llm = getLargeLanguageModel(deployment, chatMode);

  const runnableChain = RunnableSequence.from([
    {
      context: provideContext(llm),
      question: (input: ChainInput) => input.question.content.toString(),
      chatHistory: (input: ChainInput) => input.chat_history
    },
    promptTemplate,
    llm,
    new StringOutputParser()
  ]);

  if (question) {
    const stream = await runnableChain.stream({
      question: question,
      chat_history: mappedMessages
    });

    return new Response(stream, {
      headers: {
        'content-type': 'text/plain'
      }
    });
  }
}

function provideContext(llm: AzureChatOpenAI) {
  return RunnableSequence.from([
    (input: ChainInput) => rephraseQuestion(input, llm),
    getVectorStore().asRetriever(),
    (docs: Document[]) => docs.map((doc, i) => `<doc id='${i}'>${doc.pageContent}</doc>`).join('\n')
  ]);
}

function rephraseQuestion(input: ChainInput, llm: AzureChatOpenAI): RunnableSequence<ChainInput> | string {
  return input.chat_history.length > 1
    ? RunnableSequence.from([
        {
          question: (input: ChainInput) => input.question.content.toString(),
          chat_history: (input: ChainInput) => input.chat_history
        },
        rephraseTemplate,
        llm,
        new StringOutputParser()
      ])
    : input.question.content.toString();
}

function mapMessages(conversation: Conversation): BaseMessage[] {
  return conversation.messages.map((m) => {
    return m.role === ChatRole.User ? new HumanMessage(m.content) : new AIMessage(m.content);
  });
}

function getLargeLanguageModel(deployment: string, chatMode: ChatMode) {
  const template = chatModeTemplates.find((t) => t.chatMode === chatMode) ?? chatModeTemplates[0];
  return new AzureChatOpenAI({
    callbacks: [new ConsoleCallbackHandler()],
    maxRetries: 0,
    onFailedAttempt: (error) => {
      console.log(error);
    },
    azureOpenAIEndpoint: env.OpenAi_Endpoint,
    azureOpenAIApiKey: env.OpenAi_Key,
    azureOpenAIApiVersion: env.OpenAi_ApiVersion,
    azureOpenAIApiDeploymentName: deployment,
    maxTokens: Number.parseInt(env.OpenAi_MaxTokens),
    temperature: env.OpenAi_Temperature
      ? Number.parseFloat(env.OpenAi_Temperature)
      : template.value.temperature,
    frequencyPenalty: Number.parseFloat(env.OpenAi_FrequencyPenalty),
    presencePenalty: Number.parseFloat(env.OpenAi_PresencePenalty),
    topP: env.OpenAi_NucleusSamplingFactor
      ? Number.parseFloat(env.OpenAi_NucleusSamplingFactor)
      : template.value.topP
  });
}

function getEmbbedding() {
  return new OpenAIEmbeddings({
    azureOpenAIApiKey: env.OpenAi_Key,
    azureOpenAIApiVersion: env.OpenAi_ApiVersion,
    azureOpenAIApiDeploymentName: env.OpenAi_Embedding,
    azureOpenAIApiInstanceName: env.OpenAi_InstanceName,
    azureOpenAIApiEmbeddingsDeploymentName: env.OpenAi_Embedding
  });
}

function getVectorStore() {
  return new AzureAISearchVectorStore(getEmbbedding(), {
    search: {
      type: AzureAISearchQueryType.Similarity
    },
    endpoint: env.AiSearch_Endpoint,
    indexName: env.AiSearch_IndexName,
    key: env.AiSearch_Key
  });
}

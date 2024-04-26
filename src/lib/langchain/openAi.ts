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
import { RunnableSequence, RunnableMap, RunnablePassthrough } from '@langchain/core/runnables';
import {
  type ChainInput,
  chatModeTemplates,
  rephraseTemplate,
  promptTemplate,
  citationSchema,
  messageTemplate
} from './templates';
import { JsonOutputFunctionsParser, StructuredOutputParser } from 'langchain/output_parsers';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { Input } from 'postcss';
import { RunnablePick } from 'langchain/runnables';

export async function response(conversation: Conversation, chatMode: ChatMode, deployment: string) {
  // await indexDocuments(); return;
  const mappedMessages = mapMessages(conversation); // map messages to AIMessage and HumanMessage
  mappedMessages.pop(); // remove the placeholder for the response
  const question = mappedMessages.pop(); // remove the question

  const llm = getLargeLanguageModel(deployment, chatMode);

  const parser = StructuredOutputParser.fromZodSchema(citationSchema);

  const rephraseRunnable = RunnableMap.from({
    input: new RunnablePassthrough<ChainInput>(),
    question: RunnableSequence.from([
      (input: ChainInput) => {
        return { question: input.question.content.toString(), chat_history: input.chat_history };
      },
      messageTemplate,
      llm,
      new StringOutputParser()
    ])
  });

  const retrieveRunnable = RunnableMap.from({
    input: new RunnablePassthrough<ChainInput>(),
    question: new RunnablePassthrough<string>(),
    docs: RunnableSequence.from([
      await getInMemoryRetriever(),
      (docs: Document[]) =>
        docs
          .map((doc, i) => `{ id: ${i + 1}, source: '${doc.metadata.source}', content: ${doc.pageContent}}`)
          .join(',\n'),
      (output: string) => {
        console.info(output);
        return output;
      }
    ])
  });

  const ragRunnable = {
    question: (input: ChainInput) => input.question.content.toString(),
    chatHistory: (input: ChainInput) =>
      input.chat_history.map((h) => `${h.name}: ${h.content.toString()}`).join('\n'),
    format_instructions: (input: ChainInput) => input.format_instructions,
    context: RunnableSequence.from([
      (input: ChainInput) => rephraseQuestion(input, llm),
      await getInMemoryRetriever(),
      (docs: Document[]) =>
        docs
          .map((doc, i) => `{ id: ${i + 1}, source: '${doc.metadata.source}', content: ${doc.pageContent}}`)
          .join(',\n')
    ])
  };

  const runnable = rephraseRunnable
    .pipe(async (output) => {
      return {
        docs: await retrieveRunnable.invoke(output.question),
        question: output.question,
        input: output.input
      };
    })
    .pipe((output) => {
      return {
        chatHistory: output.input.chat_history,
        context: output.docs,
        question: output.question,
        format_instructions: output.input.format_instructions
      };
    });

  const easyChain = RunnableSequence.from([runnable, promptTemplate, llm, new StringOutputParser()]);

  const runnableChain = RunnableSequence.from([ragRunnable, promptTemplate, llm, new StringOutputParser()]);

  if (question) {
    const stream = await rephraseRunnable.stream({
      question: question,
      chat_history: mappedMessages,
      format_instructions: parser.getFormatInstructions()
    });

    return new Response(stream, {
      headers: {
        'content-type': 'text/plain'
      }
    });
  }
}

function rephraseQuestion(
  input: ChainInput,
  llm: AzureChatOpenAI
): RunnableSequence<ChainInput> | RunnablePassthrough<ChainInput> {
  return input.chat_history.length >= 1
    ? RunnableSequence.from([
        {
          question: (input: ChainInput) => input.question.content.toString(),
          chat_history: (input: ChainInput) => input.chat_history //.map(h => `${h.name}: ${h.content.toString()}`).join('\n')
        },
        messageTemplate,
        llm,
        new StringOutputParser()
      ])
    : new RunnablePassthrough();
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

function getRetriever() {
  return getVectorStore().asRetriever();
}

async function getInMemoryRetriever() {
  const glossarUrl =
    'https://www.gdv.de/resource/blob/6320/b4588b93ac8c40299a4bde55cf81c46b/wichtige-begriffe-fuer-die-lebensversicherung-im-ueberblick-data.pdf';
  const allgemeineBedingungenUrl =
    'https://kids.nationalgeographic.com/animals/prehistoric/article/amazing-dino-discoveries';
  const usedUrl = glossarUrl;
  const blob = await fetch(usedUrl).then((r) => r.blob());
  const loader = new WebPDFLoader(blob);

  // const loader = new CheerioWebBaseLoader(
  //   "https://lilianweng.github.io/posts/2023-06-23-agent/"
  // );

  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  });
  const splits = await textSplitter.splitDocuments(docs);
  splits.forEach((s) => (s.metadata.source = usedUrl));
  const vectorStore = await MemoryVectorStore.fromDocuments(splits, getEmbbedding());

  return vectorStore.asRetriever();
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

async function indexDocuments() {
  const loader = new PDFLoader(
    './static/01-allgemeine-bedingungen-fur-die-berufsunfahigkeits-versicherung.pdf'
  );
  const rawDocuments = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0
  });
  const documents = await splitter.splitDocuments(rawDocuments);
  console.log(documents);
  await getVectorStore().addDocuments(documents);
}

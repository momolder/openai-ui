import { env } from '$env/dynamic/private';
import { ChatMode, ChatRole, type Conversation } from '$lib/models/Contracts';
import { AzureChatOpenAI } from '@langchain/azure-openai';
import { AIMessage, HumanMessage, BaseMessage } from '@langchain/core/messages';
import {
  ChatPromptTemplate,
  PromptTemplate,
  type BasePromptTemplate,
  MessagesPlaceholder
} from '@langchain/core/prompts';
import type { AzureSearchChatExtensionConfiguration } from '@azure/openai';
import { BaseOutputParser, StringOutputParser } from '@langchain/core/output_parsers';
import { JsonOutputKeyToolsParser } from 'langchain/output_parsers';
import {
  AzureAISearchVectorStore,
  AzureAISearchQueryType
} from '@langchain/community/vectorstores/azure_aisearch';
import { createRetrieverTool } from 'langchain/tools/retriever';
import type { DocumentInterface, Document } from '@langchain/core/documents';
import { ConsoleCallbackHandler } from '@langchain/core/tracers/console';
import { OpenAIEmbeddings } from '@langchain/openai';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import {
  Runnable,
  RunnableMap,
  RunnableSequence,
  RunnablePick,
  RunnablePassthrough,
} from '@langchain/core/runnables';
import type { LanguageModelLike } from '@langchain/core/language_models/base';

const chatModeTemplates = [
  { chatMode: ChatMode.Balanced, value: { temperature: 0.7, topP: 0.95 } },
  { chatMode: ChatMode.Creative, value: { temperature: 1.31, topP: 0.29 } },
  { chatMode: ChatMode.Precise, value: { temperature: 0.1, topP: 0.5 } }
];

export async function response(conversation: Conversation, chatMode: ChatMode, deployment: string) {
  console.log('!!!!!!!!!!!!!!!!!!');
  console.log(chatMode);
  console.log(deployment);
  console.log('!!!!!!!!!!!!!!!!!!');

  const mappedMessages = mapMessages(conversation);
  mappedMessages.pop();
  const question = mappedMessages.pop();

  const llm = getLargeLanguageModel(deployment, chatMode);
  const retriever = vectorRetriever();
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You're a helpful AI assistant. Given a user question and some documents, answer the user question.
       If none of the documents answer the question, just say you don't know.
       Here are the documents:
       {context}`
    ],
    new MessagesPlaceholder('chat_history'),
    ['human', '{question}']
  ]);
  const outputParser = new JsonOutputKeyToolsParser({
    keyName: 'content',
    returnSingle: true
  });

  const answerChain = prompt.pipe(llm).pipe(new StringOutputParser());
  const map = RunnableMap.from({
    question: (input: {question: string, chat_history: BaseMessage[]}) => {console.log('question', input.chat_history); return input.question;},
    chat_history: (input: {question: string, chat_history: BaseMessage[]}) => {console.log('chat_history', input.chat_history); return input.chat_history;},
    docs: (input: {question: string, chat_history: BaseMessage[]}) => {console.log('docs', input.chat_history); return retriever.getRelevantDocuments(input.question);}
  });
  // complete chain that calls the retriever -> formats docs to string -> runs answer subchain -> returns just the answer and retrieved docs.
  const chain = map
    .assign({
      context: (input: { question: string, chat_history: BaseMessage[], docs: Document[] }) => { console.log('context', input.chat_history); return formatDocsWithId(input.docs);}
    })
    .assign({chat_history: (input: { question: string, chat_history: BaseMessage[], docs: Document[] }) => { console.log('chat_history', input.chat_history); return input.chat_history; }})
    .assign({ answer: (input: { question: string, chat_history: BaseMessage[], docs: Document[] }) => { console.log('answer', input.chat_history); return answerChain; }})
    .pick('answer');
  // .pick(["answer", "docs"]);

  // streaming
  if (question) {
    const stream = await chain.stream({
      question: question.content.toString(),
      chat_history: mappedMessages
    });

    return new Response(stream, {
      headers: {
        'content-type': 'text/plain'
      }
    });
  }
}

function getLargeLanguageModel(deployment: string, chatMode: ChatMode) {
  const template = chatModeTemplates.find((t) => t.chatMode === chatMode) ?? chatModeTemplates[0];
  return new AzureChatOpenAI({
    callbacks: [new ConsoleCallbackHandler()],
    // streaming: true,
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
    // azureExtensionOptions: {
    //   enhancements:
    //     publicEnv.PUBLIC_App_UseDocumentSearch === 'true' && conversation.useDocumentSearch
    //       ? (searchConfiguration as AzureChatEnhancementConfiguration)
    //       : undefined
    // },
    // prefixMessages: [{ role: ChatRole.System, content: env.OpenAi_SystemMessage }]
  });
}

function mapMessages(conversation: Conversation): BaseMessage[] {
  let mappedMessages = conversation.messages.map((m) => {
    return m.role === ChatRole.User ? new HumanMessage(m.content) : new AIMessage(m.content);
  });

  const pastMessagesIncluded = Number.parseInt(env.OpenAi_PastMessagesIncluded);

  mappedMessages =
    mappedMessages.length > pastMessagesIncluded
      ? mappedMessages.slice(-pastMessagesIncluded)
      : mappedMessages;

  return mappedMessages;
}

function embbedding() {
  return new OpenAIEmbeddings({
    azureOpenAIApiKey: env.OpenAi_Key,
    azureOpenAIApiVersion: env.OpenAi_ApiVersion,
    azureOpenAIApiDeploymentName: env.OpenAi_Embedding,
    azureOpenAIApiInstanceName: env.OpenAi_InstanceName,
    azureOpenAIApiEmbeddingsDeploymentName: env.OpenAi_Embedding
    // timeout: 10000,
    // batchSize: 1,
    // onFailedAttempt: (error) => {
    //   throw error;
    // },
    // maxRetries: 2
  });
}

function vectorStore() {
  return new AzureAISearchVectorStore(embbedding(), {
    search: {
      type: AzureAISearchQueryType.Similarity
    },
    endpoint: env.AiSearch_Endpoint,
    indexName: env.AiSearch_IndexName,
    key: env.AiSearch_Key
  });
}

function vectorRetriever() {
  return vectorStore().asRetriever();
}

async function indexDocuments() {
  const loader = new TextLoader('./static/doc.txt');
  const rawDocuments = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0
  });
  const documents = await splitter.splitDocuments(rawDocuments);
  console.log(documents);
  await vectorStore().addDocuments(documents);
}

function myChain<RunOutput = string>({
  llm,
  prompt,
  outputParser = new StringOutputParser() as unknown as BaseOutputParser<RunOutput>
}: {
  llm: LanguageModelLike;
  prompt: BasePromptTemplate;
  outputParser?: BaseOutputParser<RunOutput>;
  documentPrompt?: BasePromptTemplate;
  documentSeparator?: string;
}) {
  const combineDocsChain = RunnableSequence.from(
    [
      RunnablePassthrough.assign({
        ['context']: new RunnablePick('context').pipe((documents, metadata) =>
          formatDocuments({
            documentPrompt: PromptTemplate.fromTemplate('{page_content}'),
            documentSeparator: '\n\n',
            documents: documents,
            config: metadata?.config
          })
        )
      }),
      prompt,
      llm,
      outputParser
    ],
    'stuff_documents_chain'
  );

  const retrieveDocumentsChain: Runnable<{ input: string }, DocumentInterface[]> = RunnableSequence.from([
    (input) => input.input,
    retriever()
  ]);

  const retrievalChain = RunnableSequence.from<{
    input: string;
    chat_history?: BaseMessage[] | string;
  }>([
    RunnablePassthrough.assign({
      context: retrieveDocumentsChain.withConfig({
        runName: 'retrieve_documents'
      }),
      chat_history: (input) => input.chat_history ?? []
    }),
    RunnablePassthrough.assign({
      answer: combineDocsChain
    })
  ]).withConfig({ runName: 'retrieval_chain' });
  return retrievalChain;
}

function formatDocuments(input: Record<string, any>) {
  const { docs } = input;
  return (
    '\n\n' +
    docs
      .map((doc: Document) => `Article title: ${doc.metadata.title}\nArticle Snippet: ${doc.pageContent}`)
      .join('\n\n')
  );
}

function formatDocs(input: Record<string, any>): string {
  const { docs } = input;
  return (
    '\n\n' +
    docs
      .map((doc: Document) => {
        console.log(doc);
        `Article title: ${doc.metadata.title}\nArticle Snippet: ${doc.pageContent}`;
      })
      .join('\n\n')
  );
}

function formatDocsWithId(docs: Document[]): string {
  return (
    '\n\n' +
    docs
      .map(
        (doc: Document, idx: number) =>
          `Source ID: ${idx}\nArticle title: ${doc.metadata.title}\nArticle Snippet: ${doc.pageContent}`
      )
      .join('\n\n')
  );
}

function retrieverTool() {
  return createRetrieverTool(retriever(), {
    name: 'document search',
    description:
      'Searches and returns documents. The documents are then used to provide context to the language model.'
  });
}

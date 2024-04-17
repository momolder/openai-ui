import { env } from "$env/dynamic/private";
import { ChatMode } from "$lib/models/Contracts";
import { BaseMessage } from '@langchain/core/messages';
import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';

export interface ChainInput {
    question: BaseMessage;
    chat_history: BaseMessage[];
  }
  
  export const promptTemplate = ChatPromptTemplate.fromMessages([
    [
      'system',
      `${env.OpenAi_SystemMessage}. 
       Given a user question and documents, answer the user question.
       If none of the documents answer the question and you can't answer it with your knowledge, just say you don't know.
       Here are the documents:
       {context}`
    ],
    new MessagesPlaceholder('chatHistory'),
    ['human', '{question}']
  ]);
  
export const rephraseTemplate = PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow up question: {question}
Standalone Question:`);

export const chatModeTemplates = [
  { chatMode: ChatMode.Balanced, value: { temperature: 0.7, topP: 0.95 } },
  { chatMode: ChatMode.Creative, value: { temperature: 1.31, topP: 0.29 } },
  { chatMode: ChatMode.Precise, value: { temperature: 0.1, topP: 0.5 } }
];

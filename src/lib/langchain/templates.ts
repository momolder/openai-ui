import { env } from "$env/dynamic/private";
import { ChatMode } from "$lib/models/Contracts";
import { BaseMessage } from '@langchain/core/messages';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from "zod";

export interface ChainInput {
    question: BaseMessage;
    chat_history: BaseMessage[];
    format_instructions: string;
  }
  
  export const promptTemplate = PromptTemplate.fromTemplate(
      `system: ${env.OpenAi_SystemMessage}.
       Given a user question and documents, answer the user question.
       If none of the documents answer the question and you can't answer it with your knowledge, just say you don't know.
       Documents:
       {context}
       Chat history: 
       {chatHistory}
       Format Instructions:
       {format_instructions}
       human: {question}`
    );
  
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

export const citationSchema = z.object({
  answer: z.string().describe("The LLM response."),
    docs: z.array(z.object({
      sourceId: z.number().describe("The integer ID of a SPECIFIC source which justifies the answer."),
      quote: z.string().describe("The VERBATIM quote from the specified source that justifies the answer."),
      source: z.string().describe("The source of the quote.")
    }))
});
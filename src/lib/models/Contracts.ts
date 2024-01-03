export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  isFollowed: boolean;
  userId: string;
  date: Date;
  citations: Citation[];
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
  name: string;
  context: { messages: ChatMessage[] } | undefined;
}

export interface ToolMessage {
  citations: Citation[];
}

export interface Citation {
  id: number;
  title: string;
  url: string;
  content: string;
}

export interface UserInformation {
  id: string;
  displayName: string;
}

export enum ChatRole {
  Assistant = 'assistant',
  User = 'user',
  System = 'system',
  Function = 'function',
  Tool = 'tool'
}
export interface State {
  useHistory: boolean;
  useMock: boolean;
  autosave: boolean;
  version: string;
}

export interface ClientPrincipal {
  auth_typ: string;
  claims: { typ: string; val: string }[];
  name_typ: string;
  role_typ: string;
}

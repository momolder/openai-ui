# OpenAI-UI

The OpenAI UI is designed to be a simple [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/chatgpt-quickstart?tabs=command-line%2Cpython&pivots=programming-language-studio) frontend. The application is build with [Svelte](https://svelte.dev/). The App focuses on:

- Easy to setup and integrate
- Easy to customise
- Build on Azure

## Setup

There are many ways to use the app. A basic way to get started, is to set up an Azure AppService and pull the current latest image from the ghcr.io repository of the app.

### Environment variables

To get the app up and running, several environment variables are required. The bicep scripts will set up the environment.

```bash
// AI Search
AiSearch_ContentFields=
AiSearch_Endpoint="your ai search endpoint"
AiSearch_FilePathField=
AiSearch_IndexName="your ai search index name"
AiSearch_Key="your ai search key"
AiSearch_QueryType="'simple', 'semantic', 'vector', 'vectorSimpleHybrid' or 'vectorSemanticHybrid"
AiSearch_SemanticConfiguration=
AiSearch_TitleField=
AiSearch_UrlField=

// Authorization
App_ClaimName=""
App_ClaimValue=""

// Database
Database_AccountEndpoint="your database endpoint"
Database_AccountKey="your database account key"
Database_CollectionName="your database collection name for the search history"
Database_DatabaseName="your database name"

// OpenAI
OpenAi_ApiVersion="2023-10-01-preview"
OpenAi_Embedding="your OpenAI embedding deployment name"
OpenAi_Endpoint="your OpenAI endpoint"
OpenAi_FrequencyPenalty="0.0"
OpenAi_Key="your OpenAI key"
OpenAi_MaxTokens="number of tokens per message"
OpenAi_PastMessagesIncluded="max amount of messages to send to the AI service"
OpenAi_PresencePenalty="0.0"
OpenAi_StopSequences="<|im_end|>"
OpenAi_SystemMessage="your system message to customize the ai responses"
OpenAi_TokenLimit="the token limit for requests"

// Frontend (unsafe)
PUBLIC_App_Autosave="history is stored if true, otherwise new chats are not stored in the db, can be overwritten by the user"
PUBLIC_App_UseHistory="if false, database connection is not required and history is not available to the user"
PUBLIC_App_Version="version of the app"
PUBLIC_App_UseMock="if true, no ai service connection will be established"
PUBLIC_App_UseDocumentSearch="if true, enables search in the configured ai search index"
PUBLIC_OpenAi_Deployments="list of available ai deployments, e.g. gpt-3|gpt-4"
```

### Debug

To debug the application run:

```bash
npm install
cp .env.example .env.test
npm run dev -- --mode test
```

if you have an environment, update the environment variables inside .env.test with the ones matching your environment.

### Build

```bash
npm run build
```

To test the build locally, run:

```bash
npm run node
```

and open the browser on http://localhost:3000

### Docker

To host the app in a docker container either pull the image from the ghcr.io repository or:

```bash
docker build --pull --rm -f "Dockerfile" -t openaiui:latest "."
docker run --rm -d -p 80:80/tcp openaiui:latest
```

### Azure

To develop and deploy the app to Azure, install the [Azure cli](https://learn.microsoft.com/en-us/cli/azure/) and login e.g.:

```bash
az login
az account set --subscription xxxxxxx-xxxxx-xxxx-xxxxx-xxxxxxxy
```

Deploy the azure environment:

```bash
az deployment sub create --name openai-bicep-deployment --confirm-with-what-if --template-file ./infra/main.bicep --location NorthEurope --parameters ./infra/main.parameters.dev.json
```

Clean up:

```bash
az deployment sub delete --name openai-bicep-deployment
```

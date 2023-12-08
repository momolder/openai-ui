# OpenAI-UI

The OpenAI UI is designed to be a simple [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/chatgpt-quickstart?tabs=command-line%2Cpython&pivots=programming-language-studio) frontend. The application is written in [Svelte](https://svelte.dev/). The App focuses on:

- Easy to setup and integrate
- Easy to customise
- 100% Azure compatible

## Setup

There are many ways to use the app. A basic way to get started, is to set up an Azure AppService and pull the current latest image in the ghcr.io repository of the app.

### Environment variables

To get the app up and running, several environment variables are required. To easily get them into azure, use the advanced edit and add the following json elements to the settings.

```json
  {
    "name": "App_ClaimName",
    "value": "",
    "slotSetting": false
  },
  {
    "name": "App_ClaimValue",
    "value": "",
    "slotSetting": false
  },
  {
    "name": "Database_AccountEndpoint",
    "value": "your database endpoint",
    "slotSetting": false
  },
  {
    "name": "Database_AccountKey",
    "value": "your database account key",
    "slotSetting": false
  },
  {
    "name": "Database_DatabaseName",
    "value": "History",
    "slotSetting": false
  },
  {
    "name": "OpenAi_Deployment",
    "value": "your OpenAI deployment",
    "slotSetting": false
  },
  {
    "name": "OpenAi_Endpoint",
    "value": "your OpenAI endpoint",
    "slotSetting": false
  },
  {
    "name": "OpenAi_Key",
    "value": "your OpenAI key",
    "slotSetting": false
  },
  {
    "name": "OpenAi_MaxTokens",
    "value": "800",
    "slotSetting": false
  },
  {
    "name": "OpenAi_Temperature",
    "value": "0.7",
    "slotSetting": false
  },
  {
    "name": "OpenAi_FrequencyPenalty",
    "value": "0.0",
    "slotSetting": false
  },
  {
    "name": "OpenAi_PresencePenalty",
    "value": "0.0",
    "slotSetting": false
  },
  {
    "name": "OpenAi_NucleusSamplingFactor",
    "value": "0.95",
    "slotSetting": false
  },
  {
    "name": "OpenAi_StopSequences",
    "value": "<|im_end|>",
    "slotSetting": false
  },
  {
    "name": "OpenAi_SystemMessage",
    "value": "You are an AI assistant that helps people find information.",
    "slotSetting": false
  },
  {
    "name": "OpenAi_PastMessagesIncluded",
    "value": "10",
    "slotSetting": false
  },
  {
    "name": "PORT",
    "value": "80",
    "slotSetting": false
  },
  {
    "name": "PUBLIC_App_Autosave",
    "value": "true",
    "slotSetting": false
  },
  {
    "name": "PUBLIC_App_UseHistory",
    "value": "true",
    "slotSetting": false
  },
  {
    "name": "PUBLIC_App_UseMock",
    "value": "false",
    "slotSetting": false
  }
```

### Debug

To debug the application setup a .env file for the Environment variables described above, then:

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

To test the build locally, run:

```bash
node build
```

and open the browser on http://localhost:3000

### Docker

To host the app in a docker container either pull the image from the ghcr.io repository or:

```bash
docker build --pull --rm -f "Dockerfile" -t openaiui:latest "."
docker run --rm -d -p 80:80/tcp openaiui:latest
```

### Azure

To develop and manually deploy the app to Azure, install the [Azure cli](https://learn.microsoft.com/en-us/cli/azure/) and login e.g.:

```bash
az login
az account set --subscription xxxxxxx-xxxxx-xxxx-xxxxx-xxxxxxxy
```

Prepare the azure resources:

```bash
az group create --name rg-openai-ui --location eastus
az appservice plan create --resource-group rg-openai-ui --location eastus --name asp-openai-ui --is-linux --sku FREE
az webapp create --name openai-ui --plan asp-openai-ui --resource-group rg-openai-ui -r NODE:LTS
az webapp config appsettings set --resource-group rg-openai-ui --name openai-ui --settings WEBSITE_RUN_FROM_PACKAGE="1"
```

Change the publishing model:

```bash
az webapp config show --resource-group rg-openai-ui --name openai-ui
az webapp config set --name openai-ui --resource-group rg-openai-ui --linux-fx-version "NODE:LTS"
az webapp config set --name openai-ui --resource-group rg-openai-ui --linux-fx-version "DOCKER"
az webapp config container set --docker-custom-image-name ghcr.io/momolder/openai-ui:latest  --docker-registry-server-url https://ghcr.io --name openai-ui --resource-group rg-openai-ui
```

Publish the local build:

```bash
npm run deploy:zip
```

Clean up:

```bash
az group delete --no-wait --name rg-openai-ui
```

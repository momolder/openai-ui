targetScope = 'subscription'

// environment
@minLength(1)
@maxLength(64)
@description('Name of the the environment which is used to generate a short unique hash used in all resources.')
param environmentName string = 'dev'
@minLength(1)
@description('Primary location for all resources')
param location string
@minLength(1)
@description('seperate location for resources not available in primary location')
param secondaryLocation string = location
param resourceGroupName string = ''

// app service plan
param appServicePlanName string = ''
param appServicePlanSku string = 'F1'

// app
param appServiceName string = ''

// database
param cosmosAccountName string = ''
param cosmosDatabaseName string = 'db_conversation_history'
param cosmosCollectionName string = 'conversations'

// storage
@description('Name of the the storage account, no dashes allowed.')
param storageAccountName string = ''

// ai search
param searchServiceName string = ''
@allowed(['disabled', 'free', 'standard'])
param searchServiceSku string = 'free'
param searchIndexName string = 'gpt-search'
@allowed(['simple', 'vector', 'semantic', 'vectorSimpleHybrid','vectorSemanticHybrid'])
param searchQueryType string = 'simple'
@allowed(['disabled', 'free', 'standard'])
param searchSemanticSearch string = 'free'
param semanticConfiguration string = ''
param filePathField string = ''
param titleField string = ''
param urlField string = ''
param contentFields string = ''

// aiServicesAccount
param aiServicesAccountName string = ''
param aiServicesAccountSku string = 'S0'

// openai
param openAiResourceName string = ''
param openAiSku string = 'S0'
param openAIModel string = 'gpt-4'
param openAIDeployment string = openAIModel
param openAITemperature string = '0.7'
param openAIMaxTokens int = 800
param openAIStopSequence string = '<|im_end|>'
param openAISystemMessage string = 'You are an AI assistant that helps people find information.'
param openAIApiVersion string = '2023-10-01-preview'
param openAIPastMessagesIncluded int = 10
param embeddingModel string = 'text-embedding-ada-002'
param embeddingDeployment string = embeddingModel

// authentication
param authClientId string = ''
// @secure()
param authClientSecret string = ''
@description('Id of the user or app to assign application roles')
param principalId string = ''

var abbrs = loadJsonContent('abbreviations.json')
var environmentNameSafe = replace(environmentName, '-', '')
var tags = { }
var authIssuerUri = '${environment().authentication.loginEndpoint}${tenant().tenantId}/v2.0'

resource resourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: !empty(resourceGroupName) ? resourceGroupName : '${abbrs.resourcesResourceGroups}${environmentName}'
  location: location
  tags: tags
}

module appServicePlan 'core/host/appserviceplan.bicep' = {
  name: 'appserviceplan'
  scope: resourceGroup
  params: {
    name: !empty(appServicePlanName) ? appServicePlanName : '${abbrs.webServerFarms}${environmentName}'
    location: location
    tags: tags
    sku: {
      name: appServicePlanSku
      capacity: 1
    }
    kind: 'linux'
  }
}

module app 'core/host/appservice.bicep' = {
  name: 'web'
  scope: resourceGroup
  params: {
    name: !empty(appServiceName) ? appServiceName : '${abbrs.webSitesAppService}${environmentName}'
    location: location
    tags: union(tags, { 'azd-service-name': 'app' })
    appServicePlanId: appServicePlan.outputs.id
    runtimeName: 'node'
    runtimeVersion: '20-lts'
    managedIdentity: true
    // authClientSecret: authClientSecret
    // authClientId: authClientId
    // authIssuerUri: authIssuerUri
    appSettings: {
      // Frontend
      PUBLIC_App_UseHistory: 'true'
      PUBLIC_App_Version: 'dev'
      PUBLIC_App_Autosave: 'true'

      // OpenAI
      OpenAi_Endpoint: openAi.outputs.endpoint
      OpenAi_Key: openAi.outputs.key
      OpenAi_Deployment: openAIModel
      OpenAi_Embedding: embeddingModel
      OpenAi_ApiVersion: openAIApiVersion
      OpenAi_MaxTokens: openAIMaxTokens
      OpenAi_Temperature: openAITemperature
      OpenAi_FrequencyPenalty: '0.0'
      OpenAi_PresencePenalty: '0.0'
      OpenAi_NucleusSamplingFactor: '0.95'
      OpenAi_StopSequences: openAIStopSequence
      OpenAi_SystemMessage: openAISystemMessage
      OpenAi_PastMessagesIncluded: openAIPastMessagesIncluded

      // Database
      Database_DatabaseName: cosmosDatabaseName
      Database_AccountEndpoint: 'https://${cosmos.outputs.accountName}.documents.azure.com:443/'
      Database_AccountKey: cosmos.outputs.accountKey
      Database_CollectionName: cosmos.outputs.containerName

      // AI Search
      AiSearch_Endpoint: searchService.outputs.endpoint
      AiSearch_Key: searchService.outputs.adminKey
      AiSearch_IndexName: searchIndexName
      AiSearch_QueryType: searchQueryType
      AiSearch_SemanticConfiguration: semanticConfiguration
      AiSearch_FilePathField: filePathField
      AiSearch_TitleField: titleField
      AiSearch_UrlField: urlField
      AiSearch_ContentFields: contentFields
    }
  }
}

module openAi 'core/ai/cognitiveservices.bicep' = {
  name: 'openai'
  scope: resourceGroup
  params: {
    name: !empty(openAiResourceName) ? openAiResourceName : '${abbrs.cognitiveServicesAccounts}${environmentName}'
    location: secondaryLocation
    tags: tags
    sku: {
      name: openAiSku
    }
    deployments: [
      {
        name: openAIModel
        model: {
          format: 'OpenAI'
          name: openAIDeployment
          version: '0613'
        }
        capacity: 10
      }
      {
        name: embeddingDeployment
        model: {
          format: 'OpenAI'
          name: embeddingModel
          version: '2'
        }
        capacity: 30
      }
    ]
  }
}

module storage 'core/storage/storage-account.bicep' = {
  name: 'storage'
  scope: resourceGroup
  params: {
    name: !empty(storageAccountName) ? storageAccountName : '${abbrs.storageStorageAccounts}${environmentNameSafe}'
    location: secondaryLocation
    tags: tags
    publicNetworkAccess: 'Enabled'
    allowBlobPublicAccess: true
    accessTier: 'Cool'
    containers: [{name: 'search-data'}]
    deleteRetentionPolicy: {
      allowPermanentDelete: false
      enabled: true
      days: 7
    }
  }
}

module aiServicesAccount 'core/ai/cognitive-account.bicep' = {
  name: 'ai-services-account'
  scope: resourceGroup
  params: {
    name: !empty(aiServicesAccountName) ? aiServicesAccountName : '${abbrs.aiServicesMultiServiceAccount}${environmentName}'
    location: secondaryLocation
    tags: tags
    kind: 'CognitiveServices'
    sku: {
      name: aiServicesAccountSku
    }
  }
}

module searchService 'core/search/search-services.bicep' = {
  name: 'search-service'
  scope: resourceGroup
  params: {
    name: !empty(searchServiceName) ? searchServiceName : '${abbrs.searchSearchServices}${environmentName}'
    location: secondaryLocation
    tags: tags
    authOptions: {
      aadOrApiKey: {
        aadAuthFailureMode: 'http401WithBearerChallenge'
      }
    }
    sku: {
      name: searchServiceSku
    }
    semanticSearch: searchSemanticSearch
  }
}

module cosmos 'core/database/db.bicep' = {
  name: 'cosmos'
  scope: resourceGroup
  params: {
    accountName: !empty(cosmosAccountName) ? cosmosAccountName : '${abbrs.documentDBDatabaseAccounts}${environmentName}'
    location: location
    tags: tags
    principalIds: [principalId]
    databaseName: cosmosDatabaseName
    collectionName: cosmosCollectionName
  }
}

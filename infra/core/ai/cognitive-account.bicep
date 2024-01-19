param name string
param location string = resourceGroup().location
param tags object = {}

param customSubDomainName string = name
@allowed(['OpenAI', 'CognitiveServices'])
param kind string = 'OpenAI'
param publicNetworkAccess string = 'Enabled'
param sku object = {
  name: 'S0'
}


resource account 'Microsoft.CognitiveServices/accounts@2023-10-01-preview' = {
  name: name
  location: location
  tags: tags
  kind: kind
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    apiProperties: {}
    customSubDomainName: customSubDomainName
    networkAcls: {
      defaultAction: 'Allow'
      virtualNetworkRules: []
      ipRules: []
    }
    publicNetworkAccess: publicNetworkAccess
  }
  sku: sku
}

output endpoint string = account.properties.endpoint
output id string = account.id
output name string = account.name
output skuName string = account.sku.name
output key string = account.listKeys().key1

param name string
param location string = resourceGroup().location
param tags object = {}

param sku object = {
  name: 'standard'
}

param authOptions object = {}
param semanticSearch string = 'disabled'

resource search 'Microsoft.Search/searchServices@2021-04-01-preview' = {
  name: name
  location: location
  tags: tags
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'default'
    publicNetworkAccess: 'Enabled'
    networkRuleSet: {
      bypass: 'None'
      ipRules: []
    }
    encryptionWithCmk: {
      enforcement: 'Unspecified'
    }
    authOptions: authOptions
    disableLocalAuth: false
    disabledDataExfiltrationOptions: []
    semanticSearch: semanticSearch
  }
  sku: sku
}

output id string = search.id
output endpoint string = 'https://${name}.search.windows.net/'
output name string = search.name
output skuName string = sku.name
output adminKey string = search.listAdminKeys().primaryKey

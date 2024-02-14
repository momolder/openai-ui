metadata description = 'Creates an Azure Cosmos DB for NoSQL account.'
param name string
param location string = resourceGroup().location
param tags object = {}
@allowed(['Disabled', 'Enabled'])
param publicNetworkAccess string = 'Enabled'

module cosmos '../../cosmos/cosmos-account.bicep' = {
  name: 'cosmos-account'
  params: {
    name: name
    location: location
    tags: tags
    kind: 'GlobalDocumentDB'
    publicNetworkAccess: publicNetworkAccess
  }
}

output endpoint string = cosmos.outputs.endpoint
output id string = cosmos.outputs.id
output name string = cosmos.outputs.name
output key string = cosmos.outputs.key

metadata description = 'Creates an Azure Cosmos DB account.'
param name string
param location string = resourceGroup().location
param tags object = {}
@allowed([ 'GlobalDocumentDB', 'MongoDB', 'Parse' ])
param kind string
@allowed(['Disabled', 'Enabled'])
param publicNetworkAccess string = 'Enabled'

resource cosmos 'Microsoft.DocumentDB/databaseAccounts@2022-08-15' = {
  name: name
  kind: kind
  location: location
  tags: tags
  properties: {
    consistencyPolicy: { defaultConsistencyLevel: 'Session' }
    enableAnalyticalStorage: false
    analyticalStorageConfiguration: {
      schemaType: 'WellDefined'
    }
    defaultIdentity: 'FirstPartyIdentity'
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    databaseAccountOfferType: 'Standard'
    enableAutomaticFailover: false
    enableMultipleWriteLocations: false
    enableFreeTier: true
    apiProperties: (kind == 'MongoDB') ? { serverVersion: '4.0' } : {}
    capabilities: [ { name: 'EnableServerless' } ]
    publicNetworkAccess: publicNetworkAccess
  }
}

output endpoint string = cosmos.properties.documentEndpoint
output id string = cosmos.id
output name string = cosmos.name
output key string = cosmos.listKeys().primaryMasterKey

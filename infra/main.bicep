targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the the environment which is used to generate a short unique hash used in all resources.')
param environmentName string
param resourceGroupName string = ''
param location string = ''
param uniqueServiceName string = uniqueString(environmentName)

var abbrs = loadJsonContent('./abbreviations.json')

resource resourceGroup 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: !empty(resourceGroupName) ? resourceGroupName : '${abbrs.resourcesResourceGroups}${environmentName}'
  location: location
  tags: {
    environment: environmentName
  }
}

module appService 'apps/app-service.bicep' = {
  name: 'webapps'
  scope: resourceGroup
  params: {
    location: location
    name: '${abbrs.webSitesAppService}${uniqueServiceName}'
    appServicePlanId: appServicePlan.outputs.appServicePlanId
    strageAccountName: storage.outputs.accountName
    containerName: storage.outputs.containerName
  }
  dependsOn: [
    storage
  ]
}

module appServicePlan 'modules/app-service-plan.bicep' = {
  name: 'app-service-plan'
  scope: resourceGroup
  params: {
    location: location
    name: '${abbrs.webServerFarms}${uniqueServiceName}'
  }
}

module storage 'modules/storage.bicep' = {
  name: 'storage-account'
  scope: resourceGroup
  params: {
    location: location
    name: '${abbrs.storageStorageAccounts}${uniqueServiceName}'
    sku: 'Standard_LRS'
  }
}

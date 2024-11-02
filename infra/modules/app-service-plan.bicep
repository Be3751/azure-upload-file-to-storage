param location string = resourceGroup().location
param name string = 'app-service-plan'

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: name
  location: location
  sku: {
    name: 'P0v3'
    tier: 'Premium0V3'
    size: 'P0v3'
    family: 'Pv3'
    capacity: 1
  }
  kind: 'linux'
  properties: {
    // If Linux app service plan, set reserved to true
    reserved: true
  }
}

output appServicePlanId string = appServicePlan.id

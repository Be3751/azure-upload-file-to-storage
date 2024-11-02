param location string = resourceGroup().location
param name string
param appServicePlanId string

resource appService 'Microsoft.Web/sites@2023-12-01' = {
  name: name
  location: location
  tags: {
    'azd-service-name': 'api'
  }
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    enabled: true
    serverFarmId: appServicePlanId
    siteConfig: {
      numberOfWorkers: 1
      linuxFxVersion: 'NODE|20LTS'
      acrUseManagedIdentityCreds: false
      alwaysOn: false
      http20Enabled: false
      functionAppScaleLimit: 0
      minimumElasticInstanceCount: 1
    }
    keyVaultReferenceIdentity: 'SystemAssigned'
  }
}

output principalId string = appService.identity.principalId

// TODO: 環境変数を設定する

// resource name_web 'Microsoft.Web/sites/config@2023-12-01' = {
//   parent: name_resource
//   name: 'web'
//   location: 'Japan East'
//   properties: {
//     numberOfWorkers: 1
//     defaultDocuments: [
//       'Default.htm'
//       'Default.html'
//       'Default.asp'
//       'index.htm'
//       'index.html'
//       'iisstart.htm'
//       'default.aspx'
//       'index.php'
//       'hostingstart.html'
//     ]
//     netFrameworkVersion: 'v4.0'
//     linuxFxVersion: 'NODE|20LTS'
//     requestTracingEnabled: false
//     remoteDebuggingEnabled: false
//     remoteDebuggingVersion: 'VS2022'
//     httpLoggingEnabled: false
//     acrUseManagedIdentityCreds: false
//     logsDirectorySizeLimit: 35
//     detailedErrorLoggingEnabled: false
//     publishingUsername: 'REDACTED'
//     scmType: 'None'
//     use32BitWorkerProcess: true
//     webSocketsEnabled: false
//     alwaysOn: false
//     managedPipelineMode: 'Integrated'
//     virtualApplications: [
//       {
//         virtualPath: '/'
//         physicalPath: 'site\\wwwroot'
//         preloadEnabled: false
//       }
//     ]
//     loadBalancing: 'LeastRequests'
//     experiments: {
//       rampUpRules: []
//     }
//     autoHealEnabled: false
//     vnetRouteAllEnabled: false
//     vnetPrivatePortsCount: 0
//     localMySqlEnabled: false
//     managedServiceIdentityId: 8490
//     ipSecurityRestrictions: [
//       {
//         ipAddress: 'Any'
//         action: 'Allow'
//         priority: 2147483647
//         name: 'Allow all'
//         description: 'Allow all access'
//       }
//     ]
//     scmIpSecurityRestrictions: [
//       {
//         ipAddress: 'Any'
//         action: 'Allow'
//         priority: 2147483647
//         name: 'Allow all'
//         description: 'Allow all access'
//       }
//     ]
//     scmIpSecurityRestrictionsUseMain: false
//     http20Enabled: false
//     minTlsVersion: '1.2'
//     scmMinTlsVersion: '1.2'
//     ftpsState: 'FtpsOnly'
//     preWarmedInstanceCount: 0
//     elasticWebAppScaleLimit: 0
//     functionsRuntimeScaleMonitoringEnabled: false
//     minimumElasticInstanceCount: 1
//     azureStorageAccounts: {}
//   }
// }

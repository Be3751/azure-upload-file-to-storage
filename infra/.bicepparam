using 'main.bicep'

param environmentName = readEnvironmentVariable('AZURE_ENV_NAME', 'default')
param location = readEnvironmentVariable('AZURE_LOCATION', 'japaneast')
param resourceGroupName = readEnvironmentVariable('AZURE_RESOURCE_GROUP', 'rg-${environmentName}')

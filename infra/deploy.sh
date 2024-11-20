read -p "Enter the resource group name: " resourceGroupName
read -p "Enter the App Service name: " appServiceName

currentDir=$(pwd)
echo "Current directory: $currentDir"

# for frontend
cd $currentDir/app
VITE_API_SERVER=https://$appServiceName.azurewebsites.net npm run build
rm -r $currentDir/api/public/*
cp -r $currentDir/app/dist/* $currentDir/api/public

# for backend
cd $currentDir/app
rm -r $currentDir/app/api.zip
zip -r $currentDir/app/api.zip $currentDir/app/* -x "$currentDir/app/.env" -x "$currentDir/app/node_modules/*" -x "$currentDir/app/coverage/*"
az webapp deploy --resource-group $resourceGroupName --name $appServiceName --type zip --src-path $currentDir/app/api.zip
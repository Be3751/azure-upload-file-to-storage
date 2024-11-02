# for frontend
cd ../app
npm run build
rm -r ../api/public/*
cp -r dist/* ../api/public

# for backend
cd ../api
rm -r api.zip
zip -r api.zip ./* -x "./.env" -x "./node_modules/*" -x "./coverage/*"
az webapp deploy --resource-group jatco-upload-file --name jatco-web --type zip --src-path ./api.zip
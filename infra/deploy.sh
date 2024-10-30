# for frontend
cd ../app && npm run build
cp -r dist/* ../api/public

# for backend
zip -r api.zip ../api/* -x ".env"
az webapp deploy --resource-group jatco-upload-file --name jatco-web --type zip --src-path api.zip
rm api.zip
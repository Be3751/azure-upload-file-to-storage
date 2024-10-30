if [ -f api.zip ]; then
    rm api.zip
fi

# for frontend
cd ../app && npm run build
cp -r dist/* ../api/public

# for backend
zip -r api.zip ../api/* -x "../api/.env" -x "../api/node_modules/*"
az webapp deploy --resource-group jatco-upload-file --name jatco-web --type zip --src-path api.zip
rm api.zip
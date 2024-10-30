zip -r api.zip ../api/* -x ".env"
az webapp deploy --resource-group jatco-upload-file --name jatco-web --src-path api.zip

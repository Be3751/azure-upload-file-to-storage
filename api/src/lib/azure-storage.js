const DefaultAzureCredential = require('@azure/identity').DefaultAzureCredential;
const BlobServiceClient = require('@azure/storage-blob').BlobServiceClient;

defaultAzureCredential = new DefaultAzureCredential();

async function uploadBlob(accountName, containerName, blobName, blobContents) {
  const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      defaultAzureCredential
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  try {
      await containerClient.createIfNotExists();
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const uploadBlobResponse = await blockBlobClient.upload(blobContents, blobContents.length);
      console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
  } catch (error) {
      console.log(error);
  }
}

module.exports = { uploadBlob };

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const utils = require('./utils');
const { uploadBlob } = require('./lib/azure-storage');

const upload = multer();

// fn to create express server
const create = async () => {

    // server
    const app = express();

    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

    // CORS middleware
    app.use(cors());
    
    // Log request
    app.use(utils.appLogger);

    // serve static files
    app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
    app.get('/assets/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public', req.url));
    });

    // API routes
    app.get('/api/hello', (req, res) => {
        res.json({hello: 'goodbye'});
        res.end();
    });

    app.post('/api/upload', upload.single('file'), (req, res) => {
        const file = req.file;
        const filename = decodeURIComponent(req.file.originalname);

        if (!file) {
          return res.status(400).send('No file uploaded.');
        }

        uploadBlob(
            process.env.AZURE_STORAGE_ACCOUNT_NAME,
            process.env.AZURE_STORAGE_CONTAINER_NAME,
            filename,
            file.buffer
        )
        .then(() => {
            console.log('File uploaded to Azure Blob Storage.');
            res.status(200).send('File uploaded to Azure Blob Storage.');
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error uploading file to Azure Blob Storage.');
        });
        
    });

    // Catch errors
    app.use(utils.logErrors);
    app.use(utils.clientError404Handler);
    app.use(utils.clientError500Handler);
    app.use(utils.errorHandler);

    return app;
};

module.exports = {
    create
};

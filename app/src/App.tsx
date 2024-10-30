import { Box, Button, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import ErrorBoundary from './components/error-boundary';
import { convertFileToArrayBuffer } from './lib/convert-file-to-arraybuffer';

import axios, { AxiosResponse } from 'axios';
import './App.css';

// Used only for local development
const API_SERVER = import.meta.env.VITE_API_SERVER as string;

const request = axios.create({
  baseURL: API_SERVER,
  headers: {
    'Content-type': 'application/json'
  }
});

const maxUploadBytes = 256000*1000;

function App() {
  const containerName = `upload`;
  const [inputValidMsg, setInputValidMsg] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    // reset
    setUploadStatus('');

    const { target } = event;

    if (!(target instanceof HTMLInputElement)) return;
    if (
      target?.files === null ||
      target?.files?.length === 0 ||
      target?.files[0] === null
    )
      return;
    
    if (
      !target?.files[0].name.endsWith('.xlsx') &&
      !target?.files[0].name.endsWith('.json')
    ) {
      setInputValidMsg('Only Excel (.xlsx) and JSON files are allowed.');
      return;
    }

    setSelectedFile(target?.files[0]);
  };

  const handleFileUpload = () => {
    // setUploadStatus('Now uploading');
    let dots = '';
    const interval = setInterval(() => {
      dots += '.';
      setUploadStatus(`Now uploading${dots}`);
    }, 500);
    
    convertFileToArrayBuffer(selectedFile as File)
      .then((fileArrayBuffer) => {
        if (
          fileArrayBuffer === null ||
          fileArrayBuffer.byteLength < 1 ||
          fileArrayBuffer.byteLength > maxUploadBytes
        ) {
          setUploadStatus('File is empty or too large');
          return;
        }
        
        const form = new FormData();
        const encodedFilename = encodeURIComponent(selectedFile?.name || '');
        form.append('file', selectedFile as File, encodedFilename);
        request.post(`/api/upload`, form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response: AxiosResponse) => {
          if (response.status === 200) {
            clearInterval(interval);
            setUploadStatus('Successfully uploaded file to Azure Storage');
          }
        });
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          const { message, stack } = error;
          clearInterval(interval);
          setUploadStatus(
            `Failed to finish upload with error : ${message} ${stack || ''}`
          );
        } else {
          setUploadStatus(error as string);
        }
      })
  };

  return (
    <>
      <ErrorBoundary>
        <Box m={4}>
          {/* App Title */}
          <Typography variant="h4" gutterBottom>
            Upload file (Excel or JSON) to Azure Storage
          </Typography>
          <Typography variant="h5" gutterBottom>
            with Managed ID
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Target Container: {containerName}</b>
          </Typography>

          {/* File Selection Section */}
          <Box
            display="block"
            justifyContent="left"
            alignItems="left"
            flexDirection="column"
            my={4}
          >
            <Button variant="contained" component="label">
              Select File
              <input type="file" hidden onChange={handleFileSelection} />
            </Button>
            {inputValidMsg && (
              <Box my={2}>
                <Typography variant="body2" color="red">{inputValidMsg}</Typography>
              </Box>
            )}
            {selectedFile && selectedFile.name && (
              <Box my={2}>
                <Typography variant="body2">{selectedFile.name}</Typography>
              </Box>
            )}
          </Box>

          {/* File Upload Section */}
          <Box
            display="block"
            justifyContent="left"
            alignItems="left"
            flexDirection="column"
            my={4}
          >
            <Button variant="contained" onClick={handleFileUpload}>
              Upload
            </Button>
            {uploadStatus && (
              <Box my={2}>
                <Typography variant="body2" gutterBottom>
                  {uploadStatus}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </ErrorBoundary>
    </>
  );
}

export default App;

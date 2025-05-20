import React from 'react';
import { Box, Button, Paper } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

const QRCode = ({ qrCode }) => {
  // Function to download the QR code as an image
  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'cinema-ticket-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          width: 'fit-content',
          backgroundColor: 'white',
          borderRadius: 2,
          mb: 2,
        }}
      >
        <img
          src={qrCode}
          alt="Reservation QR Code"
          style={{ width: '200px', height: '200px' }}
        />
      </Paper>
      
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={handleDownload}
      >
        Descargar Código QR
      </Button>
    </Box>
  );
};

export default QRCode;
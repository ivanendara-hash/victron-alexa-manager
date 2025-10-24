const express = require('express');
const axios = require('axios');
const app = express();

// Base de datos de clientes - ACTUALIZA CON TU URL NGROK ACTUAL
const clientes = {
  'ivan': 'https://TU-URL-ACTUAL.ngrok-free.dev'
};

app.use(express.json());

app.post('/alexa', async (req, res) => {
  try {
    const clienteUrl = clientes['ivan'];
    console.log('Redirigiendo a:', clienteUrl);
    
    const alexaResponse = await axios.post(clienteUrl + '/alexa', req.body);
    res.json(alexaResponse.data);
    
  } catch (error) {
    console.error('Error:', error.message);
    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Error conectando al sistema Victron. Verifica la conexión."
        },
        shouldEndSession: true
      }
    });
  }
});

app.get('/', (req, res) => {
  res.send('Victron Alexa Manager - Backend Activo');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend ejecutando en puerto ${PORT}`);
});

const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const token = 'f465d131-ccbb-49B1-8a11-41ac42dad697';
  const installationId = '761526';
  
  try {
    const alexaRequest = req.body.request;
    const requestType = alexaRequest.type;
    
    // Manejar LaunchRequest (cuando dicen "Abre Victron")
    if (requestType === 'LaunchRequest') {
      return res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: "Bienvenido al sistema Victron. Puedes preguntar por el estado de la batería o la producción solar."
          },
          shouldEndSession: false
        }
      });
    }
    
    // Manejar Intents (cuando dicen "batería" o "solar")
    if (requestType === 'IntentRequest') {
      const response = await axios.get(
        `https://vrmapi.victronenergy.com/v2/installations/${installationId}/stats`,
        { 
          headers: { 
            'X-Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = response.data;
      const soc = data.records?.batterySoc || 0;
      const solar = data.records?.solarPower || 0;
      
      let speechText = '';
      const intentName = alexaRequest.intent?.name || '';
      
      if (intentName.includes('Battery')) {
        speechText = `El nivel de batería es del ${Math.round(soc)} por ciento.`;
      } else if (intentName.includes('Solar')) {
        speechText = `La producción solar es de ${Math.round(solar)} vatios.`;
      } else {
        speechText = `Batería al ${Math.round(soc)}% y producción solar de ${Math.round(solar)} vatios.`;
      }
      
      return res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: speechText
          },
          shouldEndSession: true
        }
      });
    }
    
    // Si llega otro tipo de request
    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "No entendí tu solicitud."
        },
        shouldEndSession: true
      }
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Error conectando al sistema Victron."
        },
        shouldEndSession: true
      }
    });
  }
};

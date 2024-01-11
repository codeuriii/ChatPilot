const axios = require('axios');

const apiKey = 'VOTRE_CLE_API'; // Remplacez par votre clé d'API OpenAI
const endpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions'; // L'URL de l'API Codex

const codeToComplete = 'Votre code ici...'; // Le code que vous souhaitez compléter

axios.post(endpoint, {
  prompt: codeToComplete,
  max_tokens: 100, // Paramètre facultatif pour contrôler la longueur de la sortie
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
})
  .then(response => {
    console.log(response.data.choices[0].text); // Affiche la réponse de l'API
  })
  .catch(error => {
    console.error('Erreur lors de la requête à l\'API OpenAI:', error);
  });

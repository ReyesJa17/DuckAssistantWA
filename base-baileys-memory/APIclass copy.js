// const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));


class APIChat {
  constructor(baseURL) {
    this.baseURL = baseURL || 'http://localhost:3001/api/v1/message';
  }

  async sendMessage(prompt) {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (response.status === 200) {
      const data = await response.json();
      const chat_response = data.response;
      return chat_response;
    } else {
      throw new Error(`Error en la API: ${response.status}`);
    }
  }
}

module.exports = APIChat;
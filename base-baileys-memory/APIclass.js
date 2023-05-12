const axios = require('axios');

class APIChat {
  constructor(baseURL) {
    this.baseURL = baseURL || 'http://0.0.0.0:8000/v1/chat/completions';
  }

  async sendConversationMessage(message) {
    const apiUrl = 'https://None@duckai.scm.azurewebsites.net/DuckAI.git';

    try {
      const response = await axios.post(apiUrl, { message: message });

      if (response.status === 200) {
        const data = response.data;
        const guardrailsResult = data.guardrails_result;
        const googleCalendarEvents = data.google_calendar_events;

        // Process the Google Calendar events
        const eventsText = googleCalendarEvents.map(event => `- ${event}`).join('\n');
        const responseMessage = `${guardrailsResult}\n\nUpcoming events:\n${eventsText}`;

        return responseMessage;
      } else {
        throw new Error(`Error in the API: ${response.status}`);
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return null;
    }
  }
}

module.exports = APIChat;


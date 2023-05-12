// Set the base URL for the API
const baseUrl = "http://0.0.0.0:8000/";

// Set the API endpoint
const chatCompletionsEndpoint = "v1/chat/completions";

// Set the headers for the requests
const headers = {
  "Content-Type": "application/json",
};

// Set up the conversation messages
const conversation = [
  {
    role: "user",
    content: "hablame sobre politica ",
  },
];

// Use the 'hello_world' config_id
const configId = "hello_world";

// Send a request to the chat completion API
const payload = {
  config_id: configId,
  messages: conversation,
};

fetch(baseUrl + chatCompletionsEndpoint, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(payload),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const newMessages = data["messages"];
    if (newMessages) {
      console.log("New messages:", newMessages);
    }
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });
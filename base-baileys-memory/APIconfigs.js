const baseUrl = "http://0.0.0.0:8000/";

const railsConfigsEndpoint = "v1/rails/configs";
const chatCompletionsEndpoint = "v1/chat/completions";

const headers = {
  "Content-Type": "application/json",
};

// Get the list of available rails configurations
fetch(baseUrl + railsConfigsEndpoint, {
  method: "GET",
  headers: headers,
})
  .then((response) => {
    console.log("Response status code:", response.status);
    console.log("Response content type:", response.headers.get("Content-Type"));
    return response.json();
  })
  .then((configs) => {
    console.log("Available configurations:", configs);

    // Choose a config_id from the available configurations
    const configId = configs[0]["id"];

    // Set up the conversation messages
    const conversation = [
      {
        role: "user",
        content: "hablame sobre politica ",
      },
    ];

    // Send a request to the chat completion API
    const payload = {
      config_id: configId,
      messages: conversation,
    };

    return fetch(baseUrl + chatCompletionsEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });
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

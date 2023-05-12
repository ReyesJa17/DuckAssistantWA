import requests
import json

# Set the base URL for the API
base_url = "http://localhost:8000/"

# Set the API endpoint
chat_completions_endpoint = "v1/chat/completions"

# Set the headers for the requests
headers = {
    "Content-Type": "application/json",
}

# Set up the conversation messages
conversation = [
    {
        "role": "user",
        "content": "me siento muy mal"
    }
]

# Use the 'hello_world' config_id
config_id = "hello_world"

# Send a request to the chat completion API
payload = {
    "config_id": config_id,
    "messages": conversation
}
response = requests.post(base_url + chat_completions_endpoint, headers=headers, data=json.dumps(payload))

try:
    new_messages = response.json()["messages"]
except json.JSONDecodeError:
    print("Invalid JSON response")
    new_messages = None

if new_messages:
    print("New messages:", new_messages)

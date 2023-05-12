import requests
import json

# Set the base URL for the API
base_url = "http://localhost:8000/"

# Set the API endpoints
rails_configs_endpoint = "v1/rails/configs"
chat_completions_endpoint = "v1/chat/completions"

# Set the headers for the requests
headers = {
    "Content-Type": "application/json",
}

# Get the list of available rails configurations
response = requests.get(base_url + rails_configs_endpoint, headers=headers)
print("Response status code:", response.status_code)
print("Response text:", response.text)
print("Response content type:", response.headers.get("Content-Type"))

try:
    configs = response.json()
except json.JSONDecodeError:
    print("Invalid JSON response")
    configs = None

if configs:
    print("Available configurations:", configs)

    # Choose a config_id from the available configurations
    config_id = configs[0]["id"]


    # Set up the conversation messages
    conversation = [
        {
            "role": "user",
            "content": "hablame sobre politica "
        }
    ]

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

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import ollama

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Fixed model name
MODEL_NAME = "deepseek-r1"

@app.route("/api/chat", methods=["POST"])
def chat():
    """Handles user messages and returns AI responses."""
    data = request.json
    messages = data.get("messages", [])
    
    if not messages or not isinstance(messages, list):
        return jsonify({"error": "Invalid request format, 'messages' should be a list"}), 400
    
    user_message = messages[-1].get("content", "")
    if not user_message:
        return jsonify({"error": "Message cannot be empty"}), 400
    
    response = ollama.chat(model=MODEL_NAME, messages=[{"role": "user", "content": user_message}])
    
    return jsonify({"response": response["message"]})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001)
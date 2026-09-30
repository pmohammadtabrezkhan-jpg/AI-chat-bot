from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os

app = Flask(__name__)

# NVIDIA API connection
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY")
)

# Conversation memory
conversation = []


# =========================
# HOME PAGE
# =========================

@app.route("/")
def home():
    return render_template("index.html")


# =========================
# CHAT
# =========================

@app.route("/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        message = data.get("message", "")


        # Add user's message
        conversation.append({
            "role": "user",
            "content": message
        })


        # Send conversation to NVIDIA
        completion = client.chat.completions.create(

            model="openai/gpt-oss-20b",

            messages=conversation,

            temperature=1,

            top_p=1,

            max_tokens=1000,

            stream=False
        )


        # Get AI response
        answer = completion.choices[0].message.content


        # Add AI response to conversation memory
        conversation.append({

            "role": "assistant",

            "content": answer

        })


        return jsonify({

            "response": answer

        })


    except Exception as e:

        print("ERROR:", e)

        return jsonify({

            "error": str(e)

        }), 500


# =========================
# LOAD PREVIOUS CHAT
# =========================

@app.route("/load_chat", methods=["POST"])
def load_chat():

    global conversation

    try:

        data = request.get_json()

        conversation = data.get("messages", [])


        return jsonify({

            "message": "Conversation loaded"

        })


    except Exception as e:

        print("ERROR:", e)

        return jsonify({

            "error": str(e)

        }), 500


# =========================
# CLEAR CONVERSATION
# =========================

@app.route("/clear", methods=["POST"])
def clear():

    conversation.clear()


    return jsonify({

        "message": "Chat cleared"

    })


# =========================
# START SERVER
# =========================

if __name__ == "__main__":

    app.run(debug=True)

# AI-chat-bot
# 🤖 AI Chatbot

A web-based AI chatbot that answers user questions in real time. The frontend is built with HTML, CSS, and JavaScript, and a Python Flask backend sends each message to an AI API and returns the response.

**🔗 Live Demo:** [https://ai-chat-bot-8vqd.onrender.com](https://ai-chat-bot-8vqd.onrender.com)

> ⏳ **Note:** This app is hosted on Render's free tier. If it has been idle, the first load may take up to a minute while the server wakes up.

<!-- Add a screenshot or GIF here. Example: ![Chatbot Screenshot](screenshot.png) -->

---

## ✨ Features

- Real-time chat interface with a clean, simple UI
- Flask backend that handles requests and talks to the AI API
- REST API integration with request handling
- Error handling for failed or empty responses
- API key stored securely using environment variables (never committed to the repo)
- Deployed online using Render

## 🛠️ Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | HTML5, CSS3, JavaScript            |
| Backend    | Python, Flask                      |
| AI         | **[YOUR AI API, e.g. Gemini / OpenAI]** |
| Deployment | Render                             |
| Tools      | Git, GitHub, VS Code               |

## 📁 Project Structure

```
AI-chat-bot/
├── app.py              # Flask backend
├── templates/
│   └── index.html      # Chat interface
├── static/
│   ├── style.css       # Styling
│   └── script.js       # Frontend logic
├── requirements.txt    # Python dependencies
├── .gitignore
└── README.md
```

> Update this to match your actual folder layout.

## 🚀 Run Locally

**1. Clone the repository**

```bash
git clone https://github.com/pmohammadtabrezkhan-jpg/AI-chat-bot.git
cd AI-chat-bot
```

**2. Create a virtual environment (recommended)**

```bash
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

**4. Set your API key**

Create a `.env` file in the project root (this file is ignored by Git):

```
API_KEY=your_api_key_here
```

Or set it in your terminal:

```bash
export API_KEY=your_api_key_here      # On Windows: set API_KEY=your_api_key_here
```

**5. Start the app**

```bash
python app.py
```

Open **http://127.0.0.1:5000** in your browser.

## ☁️ Deployment (Render)

1. Push the project to GitHub
2. On [Render](https://render.com), create a new **Web Service** and connect the repo
3. Set the **Build Command** to `pip install -r requirements.txt`
4. Set the **Start Command** to `gunicorn app:app`
5. Add `API_KEY` under **Environment Variables**
6. Deploy

## 🔒 Security

- The API key is read from an environment variable and is never hard-coded
- `.env` is listed in `.gitignore`

## 🔮 Future Improvements

- [ ] Conversation memory so the bot remembers earlier messages
- [ ] Loading indicator and "clear chat" button
- [ ] Rate limiting to prevent API abuse
- [ ] Save chat history in a database
- [ ] User login

## 👤 Author

**P Mohammad Tabrez Khan**
B.Tech EEE Student | Python & Web Development

- GitHub: [@pmohammadtabrezkhan-jpg](https://github.com/pmohammadtabrezkhan-jpg)
- Email: pmohammadtabrezkhan@gmail.com

# VibeChef – AI-Powered Recipe Generator

**Developed By:** Kuram Vasini

## 🔗 Project Links

🌐 **Live Demo:** https://vibechef-recipe-generator.onrender.com/

💻 **GitHub Repository:** https://github.com/kuramvasini8-lab/VibeChef-Recipe-Generator

---

# Project Overview

VibeChef is an AI-powered web application designed to help users decide what they can cook using the ingredients available to them.

Users can enter the ingredients they currently have, and the application uses an AI model to generate a suitable recipe suggestion. The project combines a frontend interface, Node.js and Express.js backend, Groq AI integration, MongoDB, Docker containerization, and cloud deployment using Render.

---

# Features

* Ingredient-Based Recipe Generation
* AI-Powered Recipe Suggestions
* Dynamic Recipe Generation using LLM
* User-Friendly Interface
* Groq AI Integration
* Backend API Integration
* Secure API Key Management
* Environment Variable Configuration
* MongoDB Integration
* Docker Containerization
* Cloud Deployment using Render
* Publicly Accessible Web Application

---

# Project Files

```text
VibeChef/

│── models/
│   └── Recipe.js
│
│── public/
│   └── Frontend Files
│
│── server.js
│── package.json
│── package-lock.json
│── Dockerfile
│── .env.example
│── .gitignore
│── .dockerignore
│── README.md
```

---

# Technologies Used

* HTML5
* CSS3
* JavaScript
* Node.js
* Express.js
* Groq API
*openai/gpt-oss-120b
* MongoDB
* Mongoose
* REST API
* Environment Variables
* Render
* Git
* GitHub

The project report identifies HTML, CSS, and JavaScript as the frontend technologies; Node.js and Express.js for the backend; Groq API with theopenai/gpt-oss-120b model for AI; Docker for containerization; and Render for deployment.

---

# Application Sections

### Home Section

Provides the main interface of VibeChef where users can interact with the recipe-generation functionality.

### Ingredient Input Section

Allows users to enter the ingredients currently available in their kitchen.

The application uses the provided ingredients as the main input for generating a suitable recipe suggestion.

### AI Recipe Generation Section

The entered ingredients are sent from the frontend to the backend. The backend communicates with the Groq API, where theopenai/gpt-oss-120b model processes the input and generates a recipe suggestion.

### Generated Recipe Section

Displays the AI-generated recipe suggestion returned from the backend to the user.

---

# API Overview

### Groq API

VibeChef uses the Groq API to connect the backend with a Large Language Model.

**AI Model Used:**

```text
openai/gpt-oss-120b
```

The model processes the user's ingredient input and generates a suitable recipe suggestion.

---

### Backend API

The VibeChef backend handles communication between the frontend and Groq AI.

**Application Flow:**

```text
User Input
    ↓
Frontend
    ↓
Backend
    ↓
Groq API
    ↓
openai/gpt-oss-120b
    ↓
Backend
    ↓
Frontend
    ↓
Generated Recipe
```

---

### MongoDB

MongoDB is used as part of the application's backend data storage.

The project uses environment configuration including:

```text
GROQ_API_KEY
MONGODB_URI
GROQ_MODEL
PORT
```

Sensitive configuration values are provided through environment variables rather than being exposed in the frontend.

---

# Prompting Strategy

Prompt engineering was used to communicate the user's ingredient information to the AI model.

The application provides the AI with the available ingredients and requests a suitable recipe suggestion.

The prompting approach focuses on:

* Understanding the complete ingredient input
* Generating a recipe relevant to the ingredients
* Producing a useful response
* Making the generated response easy to understand

AI-assisted development tools were also used during project planning, implementation, debugging, and development.

---

# How to Run

1. Download or clone the repository.

2. Open the project folder.

3. Install the required dependencies.

```bash
npm install
```

4. Create a `.env` file in the project root.

5. Add the required environment variables.

```text
GROQ_API_KEY=your_api_key
MONGODB_URI=your_mongodb_connection_string
GROQ_MODEL=openai/gpt-oss-120b
PORT=3000
```

6. Start the application.

```bash
npm start
```

7. Open the application in your browser.

```text
http://localhost:3000
```

8. Ensure an active internet connection is available for the AI API and database services.

---

# Docker

VibeChef is containerized using Docker to provide a consistent environment for running the application.

Build the Docker image:

```bash
docker build -t vibechef .
```

Run the container:

```bash
docker run -p 3000:3000 --env-file .env vibechef
```

Docker was used during development and testing before the application was deployed to the cloud.

---

# Deployment

VibeChef is deployed on the **Render** cloud platform.

🌐 **Live Application:**

https://vibechef-recipe-generator.onrender.com/

The deployment includes the application backend and the required environment configuration for AI API integration. The deployed application was tested and verified after deployment.

---

# Learning Outcomes

* AI-Assisted Application Development
* Full-Stack Application Development
* Groq API Integration
* LLM Integration
* Prompt Engineering
* Backend Development using Node.js
* Express.js
* MongoDB Integration
* REST API Development
* Secure API Key Management
* Environment Variables
* Docker Containerization
* Cloud Deployment
* Debugging and Testing
* Git and GitHub

---

# Declaration

This project was developed by **Kuram Vasini** as part of the **Vibe Coding Masterclass**.

The project demonstrates the development of an AI-powered web application from initial ideation through frontend and backend development, AI integration, testing, Docker containerization, and public cloud deployment.

---

# Future Scope

Potential future enhancements include:

* Recipe History
* User Accounts
* Personalized Preferences
* Nutritional Information
* Ingredient Substitution Suggestions
* Shopping List Generation
* Advanced Personalization

These features are proposed future improvements and are not part of the current implemented version.

---

# License

This project is provided for educational, learning, portfolio, and project demonstration purposes.

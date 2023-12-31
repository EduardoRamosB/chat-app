# React + TypeScript + Vite + Express + MongoDB + OpenAI + S3

[![Watch the video](https://temporarypx.s3.us-west-1.amazonaws.com/ed00.png)](https://vimeo.com/897388292?share=copy)

## 🚀 Quick start

1. **Features**

    Sample application, where you can add agents (use DALL-E to generate an avatar for your agent) who will be the 'system', then you can create chats where they include one of the agents you have already created. Messages are received in SSE (Stream). You can attach images to your messages to use GPT-Vision, and that's it, start chatting!

2. **Clone the repo**

    ```shell
    git clone https://github.com/EduardoRamosB/chat-app.git
    ```
3. **Install dependencies**

    ```shell
    cd client
    npm install 
    cd server
    npm install 
    ```

4. Edit ``server/.env.example`` file to ``src/.env`` and add your API keys, DB passwords, AWS and so on.

5. MongoDB config, it will needs 2 DBs, one from dev and another for test, it connects your DB with username and password, in ``src/.env`` you can declare it. 

6. **Start developing**

    ```shell
    cd client
    npm run dev
    cd ..
    cd server
    npm run dev
    ```

7. **Start testing (Jest and Cypress)**

    Please don't forget to change in ``client/cypress/fixtures/happy_path.json`` the value of "filePath" for your own file path of your image

    ```shell
    cd client
    npx cypress open    # e2e
    cd ..
    cd server
    npm test            # unit
    ```
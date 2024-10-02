# Editorial app + Node Server

This repository includes an editorial app which acts as a frontend application to create blogs and associated posts.

The repository also includes a nodejs server which acts as a backend with apis to help in:

- getting a list of all blogs
- creating a live blog
- creating a post
- deleting a post

## Steps to setup the project repository

Follow the steps to setup both the client and server apps:

- Clone the repository using `git clone` command.
- At the project root, use the `npm i` or `npm install` command to setup dependencies for the frontend editorial app. (Follow similar commands of package installation in case you use `pnpm` or `yarn` as package manager of choice)
- Navigate to the <b>server</b> directory and use the same `npm i` or `npm install` command to install all dependencies for the server app.

## Steps to run the project

Follow the steps to setup both the client and server apps:

- For the server app, navigate to the <b>server</b> directory, and run `npm run ts-node server.ts` command on the terminal to get server up and running on port 8200 to listen for incoming api requests.
- For the frontend editorial app, at the project root, run the `npm run dev` command on your terminal.
- Navigate to `localhost:5173` on your machine to see the frontend app running.

# GCUCapstoneProject

## Little Offices

A WebSocket-enabled virtual networking application with collaboration features for friends, hobby groups, or professional teams.

## Official Hosted Deployment

Colyseus Service: [https://little-offices.herokuapp.com/colyseus/#/](https://little-offices.herokuapp.com/colyseus/#/)

Web Client: [https://dcgcucapstone.netlify.app/](https://dcgcucapstone.netlify.app/)


## Start Application

Start by installing dependencies:
 - In root (for server): `yarn`
 - Types: `cd types && yarn`
 - Client: `cd client && yarn`

Then, in two separate terminals, execute:
 - In ./client, `yarn dev`
 - In root, `yarn start`

You can view the connection status and resource usage of the Colyseus server by opening [http://localhost:2567/colyseus](http://localhost:2567/colyseus).

The web app will be running at: [http://localhost:5173/](http://localhost:5173/)


### Tools Used

- Colyseus
- React-Three-Fiber
- WBO Whiteboard
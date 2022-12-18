# Chat app p2p with zeromq

## How to run
```sh
# install dependency
yarn 

# run in dev
yarn run:all
```

This script appears to be setting up a server using the express and http libraries. It uses the WebSocket library to establish a WebSocket connection with clients, which allows for real-time, bi-directional communication between the server and its clients.

The script also appears to be using the zeromq (also known as ZeroMQ or ZMQ) library to set up publish-subscribe sockets for inter-process communication. It creates a publisher socket, binds it to a port specified as a command-line argument, and connects a subscriber socket to one or more ports also specified as command-line arguments. The subscriber socket subscribes to messages with the topic "chat" and logs any messages it receives.

The script also has a function called broadcast which sends a message to all connected clients. When a client connects, the script sets up event handlers to listen for messages and close events from the client. When the server receives a message from a client, it broadcasts the message to all connected clients and sends the message to the publisher socket, which will then send the message to any subscribed sockets.

The script also has an endpoint for an HTTP GET request to the root path ('/') which sends the index.html file in the public/www directory as the response. Finally, the server listens for connections on the port specified as a command-line argument or a default port of 8080.


"This code implementation is based on the guidelines outlined in the "Node.js Design Patterns - Third Edition" book.
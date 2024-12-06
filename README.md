# TIB (Terminal in Browser)

## Introduction

TIB (Terminal in Browser) is a browser client that sends HTTP requests.
Request method is "POST" by default.
Payload is a JSON that includes a user input string.
Optionally a token provided by the server is included in "Authorization" header.

This repository provides a Node.js server that serves a web page with terminal client.

## How to run

To start the server, install dependencies from npm and run:
```
npm start
```

## How to use

Start by defining a server URL with command: **url \<destination\>**

Type text command in input field and press enter to send request.

Press CTRL + L to clear the terminal.

Commands:
- Help text: empty input
- Set server URL: **url \<destination\>**
- Change to single terminal: **hide**
- Change to split terminal: **split**

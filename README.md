# Storm Client

Storm Client is a VSCode extension that provides a simple HTTP client UI.

## Features

* Choose HTTP methods (GET, POST, PUT, PATCH, DELETE)
* Enter a request URL
* Set request headers with optional Basic or Bearer authentication
* Provide a request body with raw, JSON or form encoding
* Send the request and view status code, headers and response body
* UI built with React inside the extension webview

## Usage

1. Run `npm install` in this folder to install dependencies (none by default).
2. Open the directory in VSCode and press `F5` to launch the extension in the Extension Development Host.
3. Open the command palette and run **Storm Client: Open** to show the request UI.

The extension opens a React-powered webview where you can fill in the request details and see the response. React and Babel scripts are loaded from a CDN so no build step is required.

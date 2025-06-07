const vscode = require('vscode');

function activate(context) {
  const disposable = vscode.commands.registerCommand('storm-client.open', () => {
    const panel = vscode.window.createWebviewPanel(
      'stormClient',
      'Storm Client',
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );
    panel.webview.html = getWebviewContent();
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

function getWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Storm Client</title>
  <style>
    body { font-family: sans-serif; padding: 10px; }
    input, select, textarea, button { width: 100%; margin-bottom: 10px; }
    textarea { height: 80px; }
    #response, #respHeaders { white-space: pre-wrap; }
  </style>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    function App() {
      const [method, setMethod] = React.useState('GET');
      const [url, setUrl] = React.useState('');
      const [authType, setAuthType] = React.useState('none');
      const [authUser, setAuthUser] = React.useState('');
      const [authPass, setAuthPass] = React.useState('');
      const [authToken, setAuthToken] = React.useState('');
      const [headers, setHeaders] = React.useState('');
      const [bodyType, setBodyType] = React.useState('raw');
      const [body, setBody] = React.useState('');
      const [status, setStatus] = React.useState('');
      const [respHeaders, setRespHeaders] = React.useState('');
      const [response, setResponse] = React.useState('');

      const sendRequest = async () => {
        let hdrs = {};
        if (headers) {
          try { hdrs = JSON.parse(headers); } catch(e) { console.error('Invalid headers JSON'); }
        }
        if (authType === 'basic') {
          const token = btoa(`${authUser}:${authPass}`);
          hdrs['Authorization'] = 'Basic ' + token;
        } else if (authType === 'bearer') {
          hdrs['Authorization'] = 'Bearer ' + authToken;
        }
        if (body && bodyType === 'json') {
          hdrs['Content-Type'] = 'application/json';
        } else if (body && bodyType === 'form') {
          hdrs['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        try {
          const options = { method, headers: hdrs };
          if (method !== 'GET' && method !== 'HEAD') {
            options.body = body;
          }
          const res = await fetch(url, options);
          setStatus(res.status + ' ' + res.statusText);
          const rh = {};
          res.headers.forEach((v, k) => rh[k] = v);
          setRespHeaders(JSON.stringify(rh, null, 2));
          const text = await res.text();
          setResponse(text);
        } catch (err) {
          setStatus('Error');
          setRespHeaders('');
          setResponse(err.toString());
        }
      };

      return (
        <div>
          <h2>Storm Client</h2>
          <label>Method</label>
          <select value={method} onChange={e => setMethod(e.target.value)}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>

          <label>URL</label>
          <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" />

          <label>Auth</label>
          <select value={authType} onChange={e => setAuthType(e.target.value)}>
            <option value="none">None</option>
            <option value="basic">Basic</option>
            <option value="bearer">Bearer</option>
          </select>
          {authType === 'basic' && (
            <div>
              <input placeholder="Username" value={authUser} onChange={e => setAuthUser(e.target.value)} />
              <input placeholder="Password" type="password" value={authPass} onChange={e => setAuthPass(e.target.value)} />
            </div>
          )}
          {authType === 'bearer' && (
            <div>
              <input placeholder="Token" value={authToken} onChange={e => setAuthToken(e.target.value)} />
            </div>
          )}

          <label>Headers (JSON)</label>
          <textarea value={headers} onChange={e => setHeaders(e.target.value)} placeholder='{"Content-Type": "application/json"}' />

          <label>Body Type</label>
          <select value={bodyType} onChange={e => setBodyType(e.target.value)}>
            <option value="raw">Raw</option>
            <option value="json">JSON</option>
            <option value="form">Form URL Encoded</option>
          </select>

          <label>Body</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} />

          <button onClick={sendRequest}>Send</button>

          <h3>Response</h3>
          <div>Status: <span>{status}</span></div>
          <pre>{respHeaders}</pre>
          <pre>{response}</pre>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>`;
}

module.exports = {
  activate,
  deactivate
};

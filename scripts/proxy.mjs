import http from 'http'
import httpProxy from 'http-proxy'

const proxy = httpProxy.createProxyServer({})

const options = {
  target: 'https://files.wildbits.app',
  port: 4000,
}

// Received a response from the target
proxy.on('proxyRes', (proxyRes, req, res) => {
  const ignoreAccessControlHeaders = header => !header.toLowerCase().startsWith('access-control-')

  proxyRes.headers = Object.keys(proxyRes.headers)
    .filter(ignoreAccessControlHeaders)
    // Create an object with all the relevant headers
    .reduce((all, header) => ({ ...all, [header]: proxyRes.headers[header] }), {})

  // Override the response Access-Control-X headers
  if (req.headers['access-control-request-method']) {
    res.setHeader('access-control-allow-methods', req.headers['access-control-request-method'])
  }
  if (req.headers['access-control-request-headers']) {
    res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers'])
  }
  if (req.headers.origin) {
    res.setHeader('access-control-allow-origin', req.headers.origin)
    res.setHeader('access-control-allow-credentials', 'true')
  }
})

// Failed to send a request to the target
proxy.on('error', (error, req, res) => {
  res.writeHead(500, {
    'Content-Type': 'text/plain',
  })
  res.end('Proxy Error: ' + error)
})

const server = http.createServer(function (req, res) {
  proxy.web(req, res, {
    target: options.target,
    secure: true, // Verify the SSL Certs
    changeOrigin: true, // Set origin of the host header to the target URL
  })
})

console.log('listening on port', options.port)
server.listen(options.port)

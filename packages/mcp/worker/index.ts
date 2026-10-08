// Atomus MCP server as a Cloudflare Worker: Streamable HTTP, stateless, read-only. Served at https://mcp.atomus.io/mcp.
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { CfWorkerJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/cfworker';
import { createServer, NAME, VERSION } from '../src/server.js';
import { webValidator } from '../src/validate-web.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version',
};
const withCors = (res: Response) => {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
};
const json = (body: unknown, status = 200) => withCors(new Response(JSON.stringify(body, null, 2), { status, headers: { 'Content-Type': 'application/json' } }));

export async function handle(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') return withCors(new Response(null, { status: 204 }));
  if (url.pathname === '/' || url.pathname === '/health') {
    return json({ name: NAME, version: VERSION, transport: 'streamable-http', endpoint: `${url.origin}/mcp`, docs: 'https://docs.atomus.io/ai/mcp/' });
  }
  if (url.pathname !== '/mcp') return json({ error: 'Not found. The MCP endpoint is /mcp.' }, 404);
  // Stateless: a fresh server and transport per request, JSON responses (no long-lived SSE streams to keep).
  if (request.method !== 'POST') {
    return json({ jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed: this stateless server only accepts POST.' }, id: null }, 405);
  }
  const server = createServer(webValidator, { remote: true, jsonSchemaValidator: new CfWorkerJsonSchemaValidator() });
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  try {
    return withCors(await transport.handleRequest(request));
  } finally {
    // Close after the response body is produced (JSON mode resolves once all responses are ready).
    queueMicrotask(() => { void transport.close(); void server.close(); });
  }
}

export default { fetch: handle };

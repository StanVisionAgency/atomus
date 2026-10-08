// atomus-mcp: the Atomus MCP server over stdio.  npx -y @stanvision/atomus-mcp
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer, VERSION } from './server.js';
import { nodeValidator } from './validate-node.js';

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log(VERSION);
  process.exit(0);
}
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`atomus-mcp ${VERSION} — Atomus design system MCP server (stdio).

Add it to your agent:
  Claude Code:  claude mcp add atomus -- npx -y @stanvision/atomus-mcp
  Others:       { "command": "npx", "args": ["-y", "@stanvision/atomus-mcp"] }

Docs: https://docs.atomus.io/ai/mcp/`);
  process.exit(0);
}

const server = createServer(nodeValidator);
await server.connect(new StdioServerTransport());

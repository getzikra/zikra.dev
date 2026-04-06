# Zikra API & Protocol Reference

Zikra exposes an API ideally suited for the Model Context Protocol (MCP) or direct HTTP invocations by AI assistants.

## Core Setup
Everything is available via `POST /webhook/zikra`. Requests must contain an `Authorization` header with a Bearer token.

```bash
curl -s -X POST http://localhost:7723/webhook/zikra \
  -H "Authorization: Bearer $ZIKRA_TOKEN" \
  -d '{"command":"search","project":"myapp","query":"how does auth work"}'
```

---

## Complete Command List

### 1. `search`
Hybrid search across Zikra vector store using metadata and keywords.

**Payload:**
```json
{
  "command": "search",
  "project": "myapp",
  "query": "search query here",
  "limit": 10
}
```
**Aliases:** `find`, `query`, `recall`, `retrieve`

### 2. `save_memory`
Save decisions, errors, architectural notes, or custom context.

**Payload:**
```json
{
  "command": "save_memory",
  "project": "myapp",
  "title": "Short descriptive title",
  "content_md": "Full markdown content to embed and save.",
  "memory_type": "decision",    // Optional: decision, architecture, error
  "tags": ["auth", "backend"]   // Optional
}
```
**Aliases:** `save`, `store`, `write`

### 3. `get_memory`
Fetch a single memory by its UUID. Unlocks large blocks without flooding context via `search`.

**Payload:**
```json
{
  "command": "get_memory",
  "id": "uuid-here",
  "project": "myapp"
}
```

### 4. `get_prompt`
Fetch a named prompt/runbook.

**Payload:**
```json
{
  "command": "get_prompt",
  "prompt_name": "zikra:rebuild_auth",
  "project": "myapp",
  "runner": "my-machine-id"
}
```

### 5. `log_run`
Always call this after a prompt run executes to update usage metrics and audit trail.

**Payload:**
```json
{
  "command": "log_run",
  "prompt_id": "uuid-returned-by-get-prompt",
  "project": "myapp",
  "runner": "my-machine-id",
  "status": "success",          // success, error, partial
  "output_summary": "Rebuilt JWT handlers."
}
```

### 6. `save_requirement`
Send unresolved business requirements to memory.

**Payload:**
```json
{
  "command": "save_requirement",
  "project": "myapp",
  "title": "API Rate Limiting",
  "content_md": "All routes under /v1 must be token-bucket rate limited to 10req/s."
}
```

### 7. `list_requirements`
List pending requirements awaiting technical execution.

**Payload:**
```json
{
  "command": "list_requirements",
  "project": "myapp"
}
```

### 8. `log_error`
Store an error before attempting to fix it. This registers a memory with type `error`.

**Payload:**
```json
{
  "command": "log_error",
  "project": "myapp",
  "title": "500 Internal Server on payment route",
  "context_md": "Stacktrace and context..."
}
```

---

## Agent-Specific Implementation Details

- **Claude Code**: Inject the API via Claude Code Stop and PreCompact hooks. The shell script intercepts context exits and POSTs payloads directly to Zikra.
- **ChatGPT & Custom GPTs**: Expose the `/webhook/zikra` via Cloudflare Tunnels and hook as a standard OpenAPI action using the schema.
- **MCP Native**: Zikra perfectly wraps into an MCP Memory Server natively. No changes to the payload scheme required.

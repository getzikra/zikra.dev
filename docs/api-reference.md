# Zikra API & Protocol Reference

Zikra exposes an API ideally suited for the Model Context Protocol (MCP) or direct HTTP invocations by AI assistants.

## Core Setup
Everything is available via `POST /webhook/zikra`. Requests must contain an `Authorization` header with a Bearer token.

```bash
curl -s -X POST http://localhost:8000/webhook/zikra \
  -H "Authorization: Bearer $ZIKRA_TOKEN" \
  -H "Content-Type: application/json" \
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
  "memory_type": "decision",
  "tags": ["auth", "backend"]
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
Call after a prompt run to update usage metrics and audit trail. Stores: project, runner, prompt_name, status, output_summary, tokens_input, tokens_output, cost_usd.

**Payload:**
```json
{
  "command": "log_run",
  "project": "myapp",
  "runner": "my-machine-id",
  "prompt_name": "zikra:rebuild_auth",
  "status": "success",
  "output_summary": "Rebuilt JWT handlers.",
  "tokens_input": 48200,
  "tokens_output": 12400
}
```

### 6. `log_error`
Store an error before attempting to fix it. This registers a record in the error_log table.

**Payload:**
```json
{
  "command": "log_error",
  "project": "myapp",
  "message": "500 Internal Server on payment route",
  "context_md": "Stacktrace and context..."
}
```

### 7. `save_requirement`
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

### 8. `list_requirements`
List pending requirements awaiting technical execution.

**Payload:**
```json
{
  "command": "list_requirements",
  "project": "myapp"
}
```

### 9. `save_prompt`
Save a prompt as memory_type=prompt with semantic embedding.

**Payload:**
```json
{
  "command": "save_prompt",
  "project": "myapp",
  "title": "weekly-code-review",
  "content_md": "Review the diff from the past week. Focus on..."
}
```

### 10. `list_prompts`
List all saved prompts for a project.

**Payload:**
```json
{
  "command": "list_prompts",
  "project": "myapp",
  "limit": 50
}
```

### 11. `promote_requirement`
Promote a requirement to another memory_type (default: `"prompt"`). Looks up by `id` or `title`.

**Payload:**
```json
{
  "command": "promote_requirement",
  "id": "uuid-here"
}
```

### 12. `create_token`
Generate a new bearer token. Requires an owner-role token.

**Payload:**
```json
{
  "command": "create_token",
  "label": "CI/CD pipeline",
  "role": "developer"
}
```

**Response:**
```json
{
  "token": "token-7f3a9b2c4d1e8f5a",
  "label": "CI/CD pipeline",
  "role": "developer"
}
```
> The `token` value is shown only once. Store it securely immediately.

### 13. `get_schema`
Returns database introspection data: engine type, table names, and DDL for each table. Does not search memories.

**Payload:**
```json
{
  "command": "get_schema"
}
```

**Response:**
```json
{
  "engine": "sqlite",
  "tables": ["memories", "prompt_runs", "error_log", "access_tokens"],
  "schema": {
    "memories": "CREATE TABLE memories (...)"
  }
}
```

### 14. `zikra_help`
Return the full command reference with fields, aliases, and descriptions.

**Payload:**
```json
{
  "command": "zikra_help"
}
```

### 15. `debug_protocol`
Return backend diagnostics: engine, db path, memory count, OpenAI key status.

**Payload:**
```json
{
  "command": "debug_protocol"
}
```

**Response:**
```json
{
  "backend": "sqlite",
  "db_path": "./zikra.db",
  "memory_count": 142,
  "openai_key_set": true,
  "version": "0.1"
}
```

---

## Agent-Specific Implementation Details

- **Claude Code**: Use the MCP SSE endpoint at `http://localhost:8000/mcp`. The installer registers it automatically in `~/.claude/settings.json`. For webhook calls, use curl with the Stop hook.
- **ChatGPT & Custom GPTs**: Expose the `/webhook/zikra` via Cloudflare Tunnels and hook as a standard OpenAPI action using the schema.
- **MCP Native**: Zikra wraps into an MCP Memory Server natively. No changes to the payload scheme required.

# Zikra Features & Capabilities

Zikra bridges the memory gap between all LLM agents in a developer's workflow (Claude Web, Claude Code, Cursor, Gemini, ChatGPT).

## AI Agent Ecosystem Features

### 1. Shared Persistent Context
A unified memory store shared natively between different AI agents. Whether an AI agent executes on Machine A in London or Machine B in Singapore, it shares the exact same contextual database. 

### 2. Decay Scoring & Stale Memory Management
Tokens and prompt budgets shouldn't be wasted on outdated information.
Zikra incorporates search-time confidence decay:
- **Decay Floor**: Memories decay to a minimum relevance floor of 0.05 over time but are never automatically deleted. Manual deletion is available via the API.

### 3. Hybrid Search
Find context by meaning or exact keyword match:
- Vector search with keyword fallback — semantic embeddings when available, full-text keyword search when embeddings are unavailable.
- Uses 1536-dimensional embeddings (OpenAI `text-embedding-3-small` or local offline equivalents) via PostgreSQL or SQLite depending on configuration.

### 4. Zero-Friction Hook System
The most tedious part of any LLM-based memory is telling the LLM to 'remember this'.
Zikra solves this via hooks:
- **Stop Hook**: Fires on Claude Code/Cursor session end. It automatically summarizes the terminal session and writes to memory implicitly.
- **PreCompact Hook**: Prevents memory loss when the agent encounters context length limits by compressing and offloading the oldest session data to Zikra right before truncation.
- **Statusline Bar**: Terminals instantly render the number of active runs and project memory size dynamically.

### 5. Storage Backends
- **SQLite** (`DB_BACKEND=sqlite`): Uses `sqlite-vec` directly in Python. 100% offline ready. Default for single-machine use.
- **PostgreSQL** (`DB_BACKEND=postgres`): Scales via `pgvector` IVFFlat nodes. Recommended for teams with concurrent writes.

### 6. RBAC (Role-Based Access Control)
Tokens enforce boundaries:
- `owner`: Full access — all commands including token management and schema.
- `admin`: All commands except `create_token`.
- `developer`: All commands except `create_token`, `get_schema`, `debug_protocol`.
- `viewer`: Read-only — search, get_memory, get_prompt, list_requirements.

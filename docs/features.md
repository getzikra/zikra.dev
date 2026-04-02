# Zikra Features & Capabilities

Zikra bridges the memory gap between all LLM agents in a developer's workflow (Claude Web, Claude Code, Cursor, Gemini, ChatGPT).

## AI Agent Ecosystem Features

### 1. Shared Persistent Context
A unified memory store shared natively between different AI agents. Whether an AI agent executes on Machine A in London or Machine B in Singapore, it shares the exact same contextual database. 

### 2. Decay Scoring & Automatic Stale Removal
Tokens and prompt budgets shouldn't be wasted on outdated information. 
Zikra incorporates automated confidence decay:
- **Errors**: Age out completely in 30 days. No manual cleanup outdating older bugs.
- **Decisions & Architectures**: Age in 90 to 180 days.
- **Auto-Deletion**: Memories falling below a dynamic baseline threshold (< 0.05 score) are quietly pruned to save compute and tokens.

### 3. Asymmetric Hybrid Search
Find context by meaning or strict text matches:
- 70% semantic vector match using 1536-dimensional embeddings (OpenAI `text-embedding-3-small` or local offline equivalents).
- 30% strict keyword match (using standard text search utilities within PostgreSQL/SQLite depending on Lite vs Pro versions).

### 4. Zero-Friction Hook System
The most tedious part of any LLM-based memory is telling the LLM to 'remember this'.
Zikra solves this via hooks:
- **Stop Hook**: Fires on Claude Code/Cursor session end. It automatically summarizes the terminal session and writes to memory implicitly.
- **PreCompact Hook**: Prevents memory loss when the agent encounters context length limits by compressing and offloading the oldest session data to Zikra right before truncation.
- **Statusline Bar**: Terminals instantly render the number of active runs and project memory size dynamically.

### 5. Multi-Version (Lite vs Pro)
- **Lite**: Uses `sqlite-vec` directly in Python. 100% offline ready.
- **Pro**: Scales via `pgvector` IVFFlat nodes. Automations hook directly into `n8n` to build dynamic LLM-driven notifications.

### 6. RBAC (Role-Based Access Control)
Tokens enforce boundaries:
- `owner`: Promotes pending requirements to executable scripts.
- `contributor`: Searches and records new memory.
- `viewer`: Strictly read-only for guest AIs across the network.

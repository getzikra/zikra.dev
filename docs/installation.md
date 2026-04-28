# Zikra Installation Guide

From zero to persistent memory across every AI session. Takes about 5 minutes.

---

## Step 1 — Install the server

Clone the repo and run the interactive installer. Zikra is a single Python process — no Docker required.

```bash
git clone https://github.com/GetZikra/zikra
cd zikra
python3 -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -e .
python3 installer.py         # interactive, ~2 minutes
python3 -m zikra
```

The installer creates a `.env` file and generates your admin token. The server binds to `http://localhost:8000` by default.

> **Run `python3 -m zikra` from the same directory as your `.env` file.**

### Expose it to other machines (optional)

To reach your server from remote teammates or other devices, use a Cloudflare Tunnel — free, permanent, no ports to open:

```bash
cloudflared tunnel --url http://localhost:8000
```

This gives you a stable public URL like `https://zikra.yourteam.com` that you can share with the team.

---

## Step 2 — Enable MCP in Claude Code

Open **Claude Code → Settings → MCP → Add Server** and paste your server's MCP endpoint:

```json
{
  "mcpServers": {
    "zikra": {
      "url": "http://your-server:8000/mcp",
      "headers": { "Authorization": "Bearer YOUR_ZIKRA_TOKEN" }
    }
  }
}
```

Replace `your-server:8000` with `localhost:8000` for local installs, or your public tunnel URL for remote servers.

> The installer does this automatically for local installs — you can skip this step if you ran `python3 installer.py` on the same machine as Claude Code.

---

## Step 3 — Run the onboarding prompt in Claude Code

Paste this into any Claude Code session:

```
Fetch https://raw.githubusercontent.com/GetZikra/zikra/main/prompts/zikra-claude-code-setup.md
and follow every instruction in it.
```

Claude will:
1. Ask for your Zikra server URL and your token
2. Install the **Stop hook** — auto-saves a memory at the end of every session
3. Install the **PreCompact hook** — saves before context is compacted
4. Install the **statusline bar** — shows live run counts and memory stats in your terminal
5. Test the connection and confirm everything works

Once complete, memory is active from the first message of every new session.

---

## Updating Zikra

### Update the server

Pull the latest code and restart:

```bash
git pull origin main
pip install -e .
python3 -m zikra   # or restart your systemd service
```

No config changes needed. Your `.env` and database are untouched.

### Update Claude Code hooks

Re-run the same onboarding prompt:

```
Fetch https://raw.githubusercontent.com/GetZikra/zikra/main/prompts/zikra-claude-code-setup.md
and follow every instruction in it.
```

The prompt detects your existing install and only refreshes what changed. Your token, credentials, and project config are preserved.

> The MCP server entry in Claude Code settings never needs to be updated manually — it reads from your server dynamically.

---

## PostgreSQL (teams with concurrent writes)

For teams that need a permanently running server with shared concurrent writes, add the following to your `.env`:

```
DB_BACKEND=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_zikra
DB_USER=postgres
DB_PASSWORD=yourpassword
```

Install with Postgres support:

```bash
pip install -e ".[postgres]"
```

Same API, same Claude Code config — backed by PostgreSQL + pgvector.

---

For full command reference and API docs, see the [README](https://github.com/GetZikra/zikra).

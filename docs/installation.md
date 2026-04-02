# Zikra Lite Installation Guide

These instructions map out the complete path for taking Zikra Lite from zero to persistent memory across any terminal-based LLM.

### 1. Install Core Machine
Set up the database and Python framework locally. This forms the persistent engine that writes and reads the context.

```bash
# Install the core
pip install zikra-lite

# Start the Python FastAPI server locally
python -m zikra
```

### 2. Expose Endpoint 
Expose your local Zikra HTTP port (default 7723) to the outside world. This allows remote agents or external MCP implementations to hit the webhook reliably.

```bash
# Expose port via ngrok
ngrok http 7723

# (or using cloudflared)
cloudflared tunnel --url http://localhost:7723
```

### 3. Connect & Test
Connect your MCP or agent to the web session and run a fast curl test to ensure your authorization token hits the SQLite database correctly.

```bash
# Provide the tunnel URL and your secret token
curl -X POST https://your-tunnel-url.ngrok.app/webhook/zikra \
     -H "Authorization: Bearer <your_token>" \
     -H "Content-Type: application/json" \
     -d '{"command": "get_schema"}'
```

### 4. Install Session Hooks
Install the background auto-save hooks into your CLI environments. Supported agents include Claude Code, Codex, and Gemini CLI. 

```bash
# Automatically sets up the Stop / PreCompact hooks in your .zshrc/.bashrc
zikra --install-hooks
```
Once complete, agents will auto-save context dynamically on loop exit or context limits.

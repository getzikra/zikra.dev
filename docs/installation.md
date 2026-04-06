# Zikra Installation Guide

These instructions map out the complete path for taking Zikra from zero to persistent memory across any terminal-based LLM.

### 1. Install and Configure

```bash
git clone https://github.com/GetZikra/zikra
cd zikra
pip install -e .
python3 installer.py
python3 -m zikra --no-onboarding
```

> The installer is interactive. Run it in a real terminal, not inside a CI pipeline or agent task.

### 2. Expose Endpoint 
Expose your local Zikra HTTP port (default 8000) to the outside world. This allows remote agents or external MCP implementations to hit the webhook reliably.

```bash
# Expose port via ngrok
ngrok http 8000

# (or using cloudflared)
cloudflared tunnel --url http://localhost:8000
```

### 3. Connect & Test
Connect your MCP or agent to the web session and run a fast curl test to ensure your authorization token hits the database correctly.

```bash
# Provide the tunnel URL and your secret token
curl -X POST https://your-tunnel-url.ngrok.app/webhook/zikra \
     -H "Authorization: Bearer <your_token>" \
     -H "Content-Type: application/json" \
     -d '{"command": "get_schema"}'
```

### 4. Install Session Hooks
Install the background auto-save hooks into your CLI environments. Supported agents include Claude Code, Codex, and Gemini CLI.

Paste the following into a Claude Code session to install Stop, PreCompact, and statusline hooks automatically:

```
Fetch https://raw.githubusercontent.com/GetZikra/zikra/main/prompts/g_zikra.md
and follow every instruction in it.
```

Once complete, agents will auto-save context dynamically on loop exit or context limits.

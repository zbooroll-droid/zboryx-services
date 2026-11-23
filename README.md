# ZBORYX services

Pay-per-call crypto data services for **trading bots and AI agents**. Every endpoint gives **3 free calls per day**; after that it answers `402 Payment Required` with an [x402](https://docs.x402.org/introduction) offer and is paid in **USDC on Base** inside the same request.

| Service | Endpoint | What you get | Price |
| --- | --- | --- | --- |
| DEX execution dossier | `GET https://zboryx.com/pub/dossier?chain=base&token=0x…&sizeUsd=25` | executable round-trip cost at your size (quotes + gas) and token safety codes; Base, Arbitrum, BNB Chain | 0.02 USDC |
| Crypto API monitor | `GET https://zboryx.com/pub/apimon` | health of DexScreener, GeckoTerminal, Helius, public RPCs, Hyperliquid… from live production traffic | 0.01 USDC |
| USDC receipts reconciliation (Base) | `GET https://zboryx.com/pub/recon?address=0x…&expected=[…]` | confirmed USDC transfers with unique ids, matched against your invoices, JSON or CSV | 0.25 USDC |
| SOL rent recovery | `GET https://zboryx.com/pub/solrecover?owner=…` | empty SPL token accounts you can close + one unsigned transaction to sign | 15 % of the SOL recovered |

Add `explain=1` to any call for a short AI explanation of the result.

## Use it from an AI assistant (MCP)

Remote MCP server (Streamable HTTP): `https://zboryx.com/pub/mcp` — no install. Example client config:

```json
{ "mcpServers": { "zboryx": { "type": "http", "url": "https://zboryx.com/pub/mcp" } } }
```

Tools: `zboryx_dossier`, `zboryx_apimon`, `zboryx_recon`. When the free trial is used up, a tool returns the x402 offer; sign it and call again with the `x_payment` argument (base64 `X-PAYMENT` payload).

## Pay with x402 (any HTTP client)

See [`examples/pay.mjs`](examples/pay.mjs): request → `402` with `accepts[0]` → sign an EIP-3009 `TransferWithAuthorization` for USDC on Base → retry with `X-PAYMENT`. The server verifies, settles on-chain and answers in the same request (`X-PAYMENT-RESPONSE` carries the transaction hash). One payment pays for one answer; retrying with the same payment returns the same answer without a new charge.

## Discovery

- Docs: https://zboryx.com/pub/
- OpenAPI: https://zboryx.com/pub/openapi.json
- llms.txt: https://zboryx.com/llms.txt
- A2A agent card: https://zboryx.com/.well-known/agent.json
- x402 resources: https://zboryx.com/.well-known/x402

Data is informational, not investment advice. No custody: SOL recovery transactions are signed by your own wallet.

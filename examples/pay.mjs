// Minimal x402 client for ZBORYX services (Node 18+, `npm i viem`). PRIVATE_KEY = a wallet holding a little USDC on Base.
import { privateKeyToAccount } from 'viem/accounts';
const url = process.argv[2] ?? 'https://zboryx.com/pub/apimon';
const acct = privateKeyToAccount(process.env.PRIVATE_KEY);
let r = await fetch(url);
if (r.status === 402) {
  const a = (await r.json()).accepts[0], now = Math.floor(Date.now() / 1000);
  const nonce = '0x' + [...crypto.getRandomValues(new Uint8Array(32))].map((b) => b.toString(16).padStart(2, '0')).join('');
  const message = { from: acct.address, to: a.payTo, value: BigInt(a.maxAmountRequired), validAfter: 0n, validBefore: BigInt(now + 120), nonce };
  const signature = await acct.signTypedData({ domain: { name: a.extra.name, version: a.extra.version, chainId: 8453, verifyingContract: a.asset },
    types: { TransferWithAuthorization: [{ name: 'from', type: 'address' }, { name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }, { name: 'validAfter', type: 'uint256' }, { name: 'validBefore', type: 'uint256' }, { name: 'nonce', type: 'bytes32' }] },
    primaryType: 'TransferWithAuthorization', message });
  const payment = { x402Version: 1, scheme: 'exact', network: 'base', payload: { signature, authorization: { from: acct.address, to: a.payTo, value: a.maxAmountRequired, validAfter: '0', validBefore: String(now + 120), nonce } } };
  r = await fetch(url, { headers: { 'X-PAYMENT': Buffer.from(JSON.stringify(payment)).toString('base64') } });
}
console.log(r.status, await r.text());

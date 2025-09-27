import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { withX402Client } from "mcpay/client";
import { createSigner, isEvmSignerWallet, isSvmSignerWallet } from "x402/types";

import dotenv from "dotenv";
dotenv.config();

export const getClient = async () => {
  const client = new Client({
    name: "director-payer-client",
    version: "1.0.0",
  });

  const EVM_PRIVATE_KEY = process.env.EVM_PRIVATE_KEY;
  if (!EVM_PRIVATE_KEY) {
    throw new Error("EVM_PRIVATE_KEY is not set");
  }

  const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL;
  if (!AGENT_SERVER_URL) {
    throw new Error("AGENT_SERVER_URL is not set");
  }

  const transport = new StreamableHTTPClientTransport(
    new URL(AGENT_SERVER_URL),
    {
      timeout: 600000,
    }
  );

  await client.connect(transport);

  const evmSigner = await createSigner("polygon-amoy", EVM_PRIVATE_KEY);

  if (!isEvmSignerWallet(evmSigner)) {
    throw new Error("Failed to create EVM signer");
  }

  return withX402Client(client, {
    wallet: {
      evm: evmSigner,
    },
    confirmationCallback: async (payment) => {
      return true;
    },
  });
};

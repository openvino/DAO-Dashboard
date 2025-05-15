// src/config/thirdwebClient.ts
import { createThirdwebClient, ThirdwebClient } from 'thirdweb';

const clientId: string = import.meta.env.VITE_TEMPLATE_CLIENT_ID;

export const client: ThirdwebClient = createThirdwebClient({
  clientId,
});

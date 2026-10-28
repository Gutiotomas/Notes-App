import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Serve the frontend as a static SPA, like the Arqueo frontend. This avoids
  // a serverless React Router invocation on every Vercel request.
  ssr: false,
} satisfies Config;

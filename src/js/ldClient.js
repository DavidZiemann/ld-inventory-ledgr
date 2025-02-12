import * as LDClient from "./ldclient.min.js";

let ldClientInstance = null;

export function getLDClient() {
  if (ldClientInstance) {
    return ldClientInstance;
  }

  const LD_CLIENT_ID = process.env.LD_CLIENT_ID;

  // Default to anonymous
  let context = {
    kind: 'user',
    anonymous: true
  };

  const OPTIONS = {
    streaming: true
  }

  ldClientInstance = LDClient.initialize(LD_CLIENT_ID, context, OPTIONS);

  // Optional: attach a one-time global 'ready' listener or set up default events
  ldClientInstance.on("ready", () => {
    console.log("LaunchDarkly Singleton is ready");
  });

  return ldClientInstance;
}
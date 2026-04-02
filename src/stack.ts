import { StackServerApp } from "@stackframe/stack";

let _app: StackServerApp<true> | undefined;

// Lazy proxy: StackServerApp constructor is deferred until first runtime access,
// so Next.js build-time module evaluation never throws on missing env vars.
export const stackServerApp = new Proxy({} as StackServerApp<true>, {
  get(_, prop) {
    if (!_app) {
      _app = new StackServerApp({ tokenStore: "nextjs-cookie" });
    }
    return Reflect.get(_app, prop, _app);
  },
});

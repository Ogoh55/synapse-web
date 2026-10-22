import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import pluginSecurity from "eslint-plugin-security";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated test/coverage output. Linting a report is just noise, and
    // `npm run lint` runs in CI on a clean checkout, so it only shows up after
    // a local coverage run.
    "coverage/**",
  ]),

  // An eslint-disable comment that no longer suppresses anything is a fixed
  // (or never-real) problem left behind as noise. Fail on it so stale
  // suppressions get removed instead of quietly accumulating, and so a
  // directive can't sit in place ready to hide a future bug on that line.
  {
    name: "suppressions",
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },

  // ---------------------------------------------------------------------------
  // Security rules (eslint-plugin-security v3)
  //
  // Philosophy: every rule here is an error, not a warning.  Warnings become
  // click-through noise; errors block the CI build immediately.
  //
  // Rules deliberately NOT enabled (with justification):
  //
  //   security/detect-object-injection
  //     Fires on every `obj[key]` access including well-typed TypeScript code
  //     where the key type is narrowed by the compiler.  Generates extreme
  //     false-positive volume across the Soroban SDK and wallet-kit helpers.
  //     Disabled to prevent alert fatigue.  Mitigate manually: review all
  //     dynamic property accesses in lib/soroban/ and lib/wallet/.
  //
  //   security/detect-non-literal-regexp
  //     Only applies when constructing RegExp from user input at runtime.
  //     This codebase does not do that; the rule carries no signal here.
  //
  //   security/detect-non-literal-fs-filename
  //     Node.js `fs` module is not used in production Next.js app routes.
  //     Inapplicable at runtime.
  //
  //   security/detect-no-csrf-before-method-override
  //     Express-specific middleware rule; this app has no Express server.
  // ---------------------------------------------------------------------------
  {
    name: "security",
    plugins: {
      security: pluginSecurity,
    },
    rules: {
      // Prevent eval() with dynamic expressions — arbitrary code execution risk
      "security/detect-eval-with-expression": "error",

      // Prevent child_process.exec with dynamic strings — command injection risk
      "security/detect-child-process": "error",

      // Prevent regex DoS via catastrophic backtracking patterns
      "security/detect-unsafe-regex": "error",

      // Prevent use of deprecated Buffer() constructor (use Buffer.alloc())
      "security/detect-buffer-noassert": "error",

      // Prevent Mustache HTML-escape disable (template injection risk)
      "security/detect-disable-mustache-escape": "error",

      // Prevent new Buffer() (deprecated, use Buffer.from() / Buffer.alloc())
      "security/detect-new-buffer": "error",

      // Prevent use of crypto.pseudoRandomBytes (deprecated, use randomBytes)
      "security/detect-pseudoRandomBytes": "error",

      // Prevent non-literal require() — possible code injection via dynamic path
      "security/detect-non-literal-require": "error",

      // Detect Unicode bidi-override characters (trojan source attack vector)
      "security/detect-bidi-characters": "error",
    },
  },
]);

export default eslintConfig;

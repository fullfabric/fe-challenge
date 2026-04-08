const JSDOMEnvironment = require('jest-environment-jsdom').TestEnvironment

// jsdom provides its own implementations of many Web APIs, but they're
// different classes from Node's native ones. This causes cross-realm
// `instanceof` failures (e.g. Node's fetch rejects jsdom's AbortSignal).
// We override them all with Node's versions to keep everything consistent.
const GLOBALS = [
  'fetch',
  'Headers',
  'Request',
  'Response',
  'FormData',
  'TextEncoder',
  'TextDecoder',
  'ReadableStream',
  'WritableStream',
  'TransformStream',
  'BroadcastChannel',
  'structuredClone',
  'AbortController',
  'AbortSignal'
]

module.exports = class extends JSDOMEnvironment {
  async setup() {
    await super.setup()

    for (const name of GLOBALS) {
      if (globalThis[name]) {
        this.global[name] = globalThis[name]
      }
    }
  }
}

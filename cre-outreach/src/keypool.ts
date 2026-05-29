/**
 * A pool of API keys with automatic failover. When a key fails in a way that
 * means it's unusable (invalid, rate-limited, or out of credits), it's marked
 * exhausted and we move to the next one — so several users' free keys can be
 * pooled into one larger shared quota.
 */
export class KeyPool {
  private exhausted = new Map<string, string>(); // key -> reason
  private idx = 0;

  constructor(
    public readonly label: string,
    public readonly keys: string[]
  ) {}

  get size(): number {
    return this.keys.length;
  }

  get remaining(): number {
    return this.keys.filter((k) => !this.exhausted.has(k)).length;
  }

  /** The next usable key, or undefined if all are exhausted. */
  current(): string | undefined {
    for (let i = 0; i < this.keys.length; i++) {
      const j = (this.idx + i) % this.keys.length;
      if (!this.exhausted.has(this.keys[j])) {
        this.idx = j;
        return this.keys[j];
      }
    }
    return undefined;
  }

  markExhausted(key: string, reason: string): void {
    if (!this.exhausted.has(key)) this.exhausted.set(key, reason);
    this.idx = (this.idx + 1) % this.keys.length; // move off this key
  }
}

/** Show only enough of a key to identify it in logs. */
export function maskKey(key: string): string {
  return key.length <= 8 ? "***" : `${key.slice(0, 4)}…${key.slice(-3)}`;
}

export type FailureKind = "rotate" | "fatal";

/**
 * Run `fn` against the pool's current key. If it throws and `classify` says
 * "rotate", mark that key exhausted and retry with the next key. "fatal" errors
 * (e.g. a bad request for one specific input) propagate immediately.
 */
export async function withRotation<T>(
  pool: KeyPool,
  fn: (key: string) => Promise<T>,
  classify: (err: unknown) => FailureKind
): Promise<T> {
  let lastError: unknown;
  for (;;) {
    const key = pool.current();
    if (!key) {
      const detail = lastError instanceof Error ? lastError.message : "unknown";
      throw new Error(
        `All ${pool.size} ${pool.label} key(s) are exhausted/failing. Last error: ${detail}`
      );
    }
    try {
      return await fn(key);
    } catch (err) {
      lastError = err;
      if (classify(err) === "fatal") throw err;
      const reason = err instanceof Error ? err.message : String(err);
      pool.markExhausted(key, reason);
      console.log(
        `  ⚠ ${pool.label} key ${maskKey(key)} failed (${reason}); ` +
          `trying next key (${pool.remaining}/${pool.size} left)...`
      );
    }
  }
}

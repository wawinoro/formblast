/**
 * fieldCooldown — prevents re-submission or re-validation within a cooldown window.
 */

export interface CooldownState {
  active: boolean;
  remainingMs: number;
  triggeredAt: number | null;
}

export interface FieldCooldown {
  trigger(): void;
  isActive(): boolean;
  getState(): CooldownState;
  reset(): void;
  onExpire(cb: () => void): () => void;
}

export function createFieldCooldown(durationMs: number): FieldCooldown {
  let triggeredAt: number | null = null;
  let timerId: ReturnType<typeof setTimeout> | null = null;
  const listeners: Set<() => void> = new Set();

  function getRemainingMs(): number {
    if (triggeredAt === null) return 0;
    const elapsed = Date.now() - triggeredAt;
    return Math.max(0, durationMs - elapsed);
  }

  function isActive(): boolean {
    return getRemainingMs() > 0;
  }

  function getState(): CooldownState {
    return {
      active: isActive(),
      remainingMs: getRemainingMs(),
      triggeredAt,
    };
  }

  function trigger(): void {
    if (isActive()) return;
    triggeredAt = Date.now();
    if (timerId !== null) clearTimeout(timerId);
    timerId = setTimeout(() => {
      timerId = null;
      listeners.forEach((cb) => cb());
    }, durationMs);
  }

  function reset(): void {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
    triggeredAt = null;
  }

  function onExpire(cb: () => void): () => void {
    listeners.add(cb);
    return () => listeners.delete(cb);
  }

  return { trigger, isActive, getState, reset, onExpire };
}

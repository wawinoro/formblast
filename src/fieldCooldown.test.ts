import { createFieldCooldown } from './fieldCooldown';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('createFieldCooldown', () => {
  it('is not active initially', () => {
    const cd = createFieldCooldown(200);
    expect(cd.isActive()).toBe(false);
    expect(cd.getState().active).toBe(false);
    expect(cd.getState().triggeredAt).toBeNull();
  });

  it('becomes active after trigger', () => {
    const cd = createFieldCooldown(500);
    cd.trigger();
    expect(cd.isActive()).toBe(true);
    expect(cd.getState().active).toBe(true);
    expect(cd.getState().triggeredAt).not.toBeNull();
  });

  it('remainingMs is positive while active', () => {
    const cd = createFieldCooldown(500);
    cd.trigger();
    expect(cd.getState().remainingMs).toBeGreaterThan(0);
  });

  it('ignores subsequent triggers while active', () => {
    const cd = createFieldCooldown(500);
    cd.trigger();
    const first = cd.getState().triggeredAt;
    cd.trigger();
    expect(cd.getState().triggeredAt).toBe(first);
  });

  it('expires after the duration and calls onExpire listeners', async () => {
    const cd = createFieldCooldown(80);
    const spy = jest.fn();
    cd.onExpire(spy);
    cd.trigger();
    expect(cd.isActive()).toBe(true);
    await sleep(120);
    expect(cd.isActive()).toBe(false);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can be triggered again after expiry', async () => {
    const cd = createFieldCooldown(60);
    cd.trigger();
    await sleep(100);
    expect(cd.isActive()).toBe(false);
    cd.trigger();
    expect(cd.isActive()).toBe(true);
  });

  it('reset clears active state and prevents listener firing', async () => {
    const cd = createFieldCooldown(200);
    const spy = jest.fn();
    cd.onExpire(spy);
    cd.trigger();
    cd.reset();
    expect(cd.isActive()).toBe(false);
    expect(cd.getState().triggeredAt).toBeNull();
    await sleep(250);
    expect(spy).not.toHaveBeenCalled();
  });

  it('onExpire returns an unsubscribe function', async () => {
    const cd = createFieldCooldown(60);
    const spy = jest.fn();
    const unsub = cd.onExpire(spy);
    unsub();
    cd.trigger();
    await sleep(100);
    expect(spy).not.toHaveBeenCalled();
  });
});

import { createFieldDebounceMap } from "./fieldDebounceMap";

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

describe("createFieldDebounceMap", () => {
  it("registers a field with a custom delay", () => {
    const map = createFieldDebounceMap();
    map.register("email", 200);
    expect(map.getDelay("email")).toBe(200);
  });

  it("returns undefined delay for unknown field", () => {
    const map = createFieldDebounceMap();
    expect(map.getDelay("unknown")).toBeUndefined();
  });

  it("uses defaultDelay when scheduling unregistered field", () => {
    const map = createFieldDebounceMap(150);
    const fn = jest.fn();
    map.schedule("name", fn);
    expect(map.getDelay("name")).toBe(150);
    map.cancel("name");
  });

  it("fires the scheduled function after delay", async () => {
    const map = createFieldDebounceMap();
    map.register("username", 50);
    const fn = jest.fn();
    map.schedule("username", fn);
    expect(fn).not.toHaveBeenCalled();
    await sleep(80);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("debounces rapid calls — only fires once", async () => {
    const map = createFieldDebounceMap();
    map.register("search", 60);
    const fn = jest.fn();
    map.schedule("search", fn);
    map.schedule("search", fn);
    map.schedule("search", fn);
    await sleep(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("cancel prevents the function from firing", async () => {
    const map = createFieldDebounceMap();
    map.register("city", 50);
    const fn = jest.fn();
    map.schedule("city", fn);
    map.cancel("city");
    await sleep(80);
    expect(fn).not.toHaveBeenCalled();
  });

  it("flush fires the function immediately", () => {
    const map = createFieldDebounceMap();
    map.register("phone", 500);
    const fn = jest.fn();
    map.schedule("phone", fn);
    expect(map.isScheduled("phone")).toBe(true);
    map.flush("phone");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(map.isScheduled("phone")).toBe(false);
  });

  it("isScheduled returns false after timer fires", async () => {
    const map = createFieldDebounceMap();
    map.register("zip", 40);
    const fn = jest.fn();
    map.schedule("zip", fn);
    expect(map.isScheduled("zip")).toBe(true);
    await sleep(70);
    expect(map.isScheduled("zip")).toBe(false);
  });

  it("unregister cancels and removes the field", async () => {
    const map = createFieldDebounceMap();
    map.register("bio", 50);
    const fn = jest.fn();
    map.schedule("bio", fn);
    map.unregister("bio");
    await sleep(80);
    expect(fn).not.toHaveBeenCalled();
    expect(map.getDelay("bio")).toBeUndefined();
  });

  it("allows updating delay via re-register", () => {
    const map = createFieldDebounceMap();
    map.register("age", 100);
    map.register("age", 400);
    expect(map.getDelay("age")).toBe(400);
  });
});

import { createDependencyGraph, buildGraphFromSchema } from './fieldDependencyGraph';

describe('createDependencyGraph', () => {
  it('adds and retrieves dependents', () => {
    const graph = createDependencyGraph();
    graph.addDependency('city', 'country');
    expect(graph.getDependents('country')).toContain('city');
  });

  it('does not duplicate dependencies', () => {
    const graph = createDependencyGraph();
    graph.addDependency('city', 'country');
    graph.addDependency('city', 'country');
    expect(graph.nodes.get('city')!.dependsOn).toHaveLength(1);
  });

  it('returns empty array for unknown field dependents', () => {
    const graph = createDependencyGraph();
    expect(graph.getDependents('unknown')).toEqual([]);
  });

  it('returns topological order', () => {
    const graph = createDependencyGraph();
    graph.addDependency('city', 'country');
    graph.addDependency('district', 'city');
    const order = graph.getOrder();
    expect(order.indexOf('country')).toBeLessThan(order.indexOf('city'));
    expect(order.indexOf('city')).toBeLessThan(order.indexOf('district'));
  });

  it('detects no cycle in acyclic graph', () => {
    const graph = createDependencyGraph();
    graph.addDependency('b', 'a');
    graph.addDependency('c', 'b');
    expect(graph.hasCycle()).toBe(false);
  });

  it('detects cycle', () => {
    const graph = createDependencyGraph();
    graph.addDependency('a', 'b');
    graph.addDependency('b', 'c');
    graph.addDependency('c', 'a');
    expect(graph.hasCycle()).toBe(true);
  });

  it('handles multiple dependents on one field', () => {
    const graph = createDependencyGraph();
    graph.addDependency('city', 'country');
    graph.addDependency('zip', 'country');
    const deps = graph.getDependents('country');
    expect(deps).toContain('city');
    expect(deps).toContain('zip');
  });
});

describe('buildGraphFromSchema', () => {
  it('builds graph from schema with dependsOn metadata', () => {
    const schema = {
      country: {},
      city: { dependsOn: ['country'] },
      district: { dependsOn: ['city'] },
    } as any;
    const graph = buildGraphFromSchema(schema);
    expect(graph.getDependents('country')).toContain('city');
    expect(graph.getDependents('city')).toContain('district');
  });

  it('handles schema entries without dependsOn', () => {
    const schema = { email: {}, username: {} } as any;
    const graph = buildGraphFromSchema(schema);
    expect(graph.hasCycle()).toBe(false);
  });
});

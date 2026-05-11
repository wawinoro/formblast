import { FieldSchema } from './types';

export interface DependencyNode {
  field: string;
  dependsOn: string[];
  dependents: string[];
}

export interface DependencyGraph {
  nodes: Map<string, DependencyNode>;
  addDependency: (field: string, dependsOn: string) => void;
  getDependents: (field: string) => string[];
  getOrder: () => string[];
  hasCycle: () => boolean;
}

export function createDependencyGraph(): DependencyGraph {
  const nodes = new Map<string, DependencyNode>();

  function ensureNode(field: string): DependencyNode {
    if (!nodes.has(field)) {
      nodes.set(field, { field, dependsOn: [], dependents: [] });
    }
    return nodes.get(field)!;
  }

  function addDependency(field: string, dependsOn: string): void {
    const node = ensureNode(field);
    const dep = ensureNode(dependsOn);
    if (!node.dependsOn.includes(dependsOn)) {
      node.dependsOn.push(dependsOn);
    }
    if (!dep.dependents.includes(field)) {
      dep.dependents.push(field);
    }
  }

  function getDependents(field: string): string[] {
    return nodes.get(field)?.dependents ?? [];
  }

  function getOrder(): string[] {
    const visited = new Set<string>();
    const result: string[] = [];

    function visit(field: string) {
      if (visited.has(field)) return;
      visited.add(field);
      const node = nodes.get(field);
      if (node) {
        for (const dep of node.dependsOn) {
          visit(dep);
        }
      }
      result.push(field);
    }

    for (const key of nodes.keys()) {
      visit(key);
    }
    return result;
  }

  function hasCycle(): boolean {
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = new Map<string, number>();

    function dfs(field: string): boolean {
      color.set(field, GRAY);
      for (const dep of nodes.get(field)?.dependsOn ?? []) {
        if (color.get(dep) === GRAY) return true;
        if (color.get(dep) !== BLACK && dfs(dep)) return true;
      }
      color.set(field, BLACK);
      return false;
    }

    for (const key of nodes.keys()) {
      if (!color.has(key) && dfs(key)) return true;
    }
    return false;
  }

  return { nodes, addDependency, getDependents, getOrder, hasCycle };
}

export function buildGraphFromSchema<T extends Record<string, unknown>>(
  schema: Partial<Record<keyof T, FieldSchema<T, unknown>>>
): DependencyGraph {
  const graph = createDependencyGraph();
  for (const [field, def] of Object.entries(schema)) {
    const deps: string[] = (def as any)?.dependsOn ?? [];
    for (const dep of deps) {
      graph.addDependency(field, dep);
    }
  }
  return graph;
}

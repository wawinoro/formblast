/**
 * fieldFile.ts
 * Declarative file input field with validation support.
 * Handles file type, size, and count constraints.
 */

export interface FileConstraints {
  /** Accepted MIME types or extensions (e.g. ['image/png', '.pdf']) */
  accept?: string[];
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Minimum file size in bytes */
  minSize?: number;
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Minimum number of files required */
  minFiles?: number;
}

export interface FieldFileState<T extends File = File> {
  files: T[];
  errors: string[];
  touched: boolean;
  valid: boolean;
}

export interface FieldFile<T extends File = File> {
  getState: () => FieldFileState<T>;
  add: (incoming: T | T[]) => void;
  remove: (index: number) => void;
  clear: () => void;
  touch: () => void;
  validate: () => boolean;
}

/** Returns true when the file matches one of the accepted types/extensions. */
function matchesAccept(file: File, accept: string[]): boolean {
  return accept.some((rule) => {
    if (rule.startsWith('.')) {
      return file.name.toLowerCase().endsWith(rule.toLowerCase());
    }
    if (rule.endsWith('/*')) {
      return file.type.startsWith(rule.slice(0, -1));
    }
    return file.type === rule;
  });
}

/**
 * Creates a file field controller with constraint-based validation.
 *
 * @example
 * const avatar = createFieldFile({ accept: ['image/*'], maxSize: 2_000_000 });
 * avatar.add(file);
 * avatar.validate(); // false if file is too large
 */
export function createFieldFile<T extends File = File>(
  constraints: FileConstraints = {}
): FieldFile<T> {
  let files: T[] = [];
  let errors: string[] = [];
  let touched = false;

  function validate(): boolean {
    errors = [];

    const { accept, maxSize, minSize, maxFiles, minFiles } = constraints;

    if (minFiles !== undefined && files.length < minFiles) {
      errors.push(`At least ${minFiles} file(s) required.`);
    }

    if (maxFiles !== undefined && files.length > maxFiles) {
      errors.push(`No more than ${maxFiles} file(s) allowed.`);
    }

    for (const file of files) {
      if (accept && accept.length > 0 && !matchesAccept(file, accept)) {
        errors.push(`"${file.name}" is not an accepted file type.`);
      }
      if (maxSize !== undefined && file.size > maxSize) {
        errors.push(
          `"${file.name}" exceeds the maximum size of ${maxSize} bytes.`
        );
      }
      if (minSize !== undefined && file.size < minSize) {
        errors.push(
          `"${file.name}" is below the minimum size of ${minSize} bytes.`
        );
      }
    }

    return errors.length === 0;
  }

  function getState(): FieldFileState<T> {
    return { files: [...files], errors: [...errors], touched, valid: errors.length === 0 };
  }

  function add(incoming: T | T[]): void {
    const list = Array.isArray(incoming) ? incoming : [incoming];
    const { maxFiles } = constraints;
    for (const f of list) {
      if (maxFiles === undefined || files.length < maxFiles) {
        files.push(f);
      }
    }
    validate();
  }

  function remove(index: number): void {
    files.splice(index, 1);
    validate();
  }

  function clear(): void {
    files = [];
    errors = [];
  }

  function touch(): void {
    touched = true;
  }

  return { getState, add, remove, clear, touch, validate };
}

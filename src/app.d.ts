declare namespace App {}

interface ImportMeta {
  glob: (pattern: string, options?: { as?: string }) => Record<string, () => Promise<unknown>>;
}

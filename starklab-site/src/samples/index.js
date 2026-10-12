/* Registry of sample UIs for the Work page. Files follow src/samples/_contract.md. */
const modules = import.meta.glob('./[0-9][0-9]-*.js', { eager: true });

export const SAMPLES = Object.entries(modules)
  .map(([path, mod]) => ({ ...mod.default, id: mod.default?.id || path.replace(/^\.\//, '').replace(/\.js$/, '') }))
  .filter(s => typeof s.render === 'function')
  .sort((a, b) => a.id.localeCompare(b.id));

export const CATEGORIES = Array.from(new Set(SAMPLES.map(s => s.category))).sort();

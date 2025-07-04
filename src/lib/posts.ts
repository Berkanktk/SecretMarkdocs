import matter from 'gray-matter';

export interface PostMetadata {
  title: string;
  slug: string;
  secret_hash: string;
  content: string;
}

function parseFrontmatter(markdown: string) {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/m.exec(markdown);
  if (!match) return { metadata: {}, content: markdown } as any;
  const yaml = match[1];
  const content = match[2];
  const metadata: Record<string, string> = {};
  yaml.split(/\n/).forEach((line) => {
    const idx = line.indexOf(':');
    if (idx >= 0) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      metadata[key] = value;
    }
  });
  return { metadata, content };
}

export async function getPost(slug: string): Promise<PostMetadata | null> {
  const modules = import.meta.glob('/content/*.md', { as: 'raw' });
  const loader = modules[`/content/${slug}.md`];
  if (!loader) return null;
  const raw = (await loader()) as string;
  const { data: metadata, content } = matter(raw);
  return { title: metadata.title, slug, secret_hash: metadata.secret_hash, content } as PostMetadata;
}

export async function getAllPosts() {
  const modules = import.meta.glob('/content/*.md', { as: 'raw' });
  const posts: PostMetadata[] = [];
  for (const path in modules) {
    const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? path;
    const raw = (await modules[path]()) as string;
    const { data: metadata, content } = matter(raw);
    posts.push({ title: metadata.title, slug, secret_hash: metadata.secret_hash, content });
  }
  return posts;
}

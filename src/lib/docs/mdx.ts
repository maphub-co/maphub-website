// Add server-only package
import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define the documentation page metadata type
export type DocPageMeta = {
  title: string;
  description: string;
  slug: string;
  order: number;
};

// Path to documentation content
const CONTENT_DIR = path.join(
  process.cwd(),
  "src/app/(public-or-protected)/docs/_content"
);

// Get all documentation page slugs
export function get_all_doc_slugs(): string[] {
  const fileNames = fs.readdirSync(CONTENT_DIR);

  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
}

// Get the frontmatter and compiled MDX content for a single documentation page
export async function get_doc_by_slug(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const meta: DocPageMeta = {
    title: data.title,
    description: data.description,
    slug,
    order: data.order || 999, // Default to a high number if order is not specified
  };

  return { meta, content };
}

// Get all documentation pages with metadata
export async function get_all_docs_pages() {
  const slugs = get_all_doc_slugs();
  const docsPromises = slugs.map((slug) => get_doc_by_slug(slug));
  const docs = await Promise.all(docsPromises);

  return docs.sort((doc1, doc2) => {
    // Sort by order in ascending order
    return doc1.meta.order - doc2.meta.order;
  });
}

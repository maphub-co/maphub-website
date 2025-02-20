// LIBRARIES
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// CONFIG
import { get_doc_by_slug, get_all_docs_pages } from "@/lib/docs/mdx";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import MdxContent from "@/components/mdx/MdxContent";

/*======= INTERFACE =======*/
interface DocsPageProps {
  params: Promise<{ slug: string }>;
}

/*======= METADATA =======*/
export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { meta } = await get_doc_by_slug(slug);

    return {
      title: meta.title,
      description: meta.description,
      alternates: {
        canonical: `https://www.maphub.co/docs/${slug}`,
      },
    };
  } catch (error: any) {
    return {
      title: "Docs",
      description: "Documentation of MapHub.co",
    };
  }
}

/*======= PAGE =======*/
export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params;

  try {
    // Get metadata and compiled MDX content
    const { content } = await get_doc_by_slug(slug);

    const all_docs = await get_all_docs_pages();

    // Find the current doc index
    const current_index = all_docs.findIndex((doc) => doc.meta.slug === slug);
    const prev_doc = current_index > 0 ? all_docs[current_index - 1] : null;
    const next_doc =
      current_index < all_docs.length - 1 ? all_docs[current_index + 1] : null;

    return (
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 2xl:gap-16">
        {/* Sidebar navigation */}
        <aside className="w-full mt-4 md:w-64 shrink-0 sticky top-20">
          <ul className="space-y-2">
            {all_docs.map((doc) => (
              <li key={doc.meta.slug}>
                <Link
                  href={`/docs/${doc.meta.slug}`}
                  className={cn(
                    "btn btn-ghost btn-size-sm w-full justify-start",
                    doc.meta.slug === slug &&
                      "bg-hover text-hover-foreground font-medium"
                  )}
                >
                  {doc.meta.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {/* Article */}
          <article className="mt-4 max-w-4xl">
            {/* MDX content */}
            <div className="prose prose-lg dark:prose-invert">
              <MdxContent source={content} />
            </div>

            {/* Pagination */}
            <div className="mt-12 pt-6 border-t flex">
              {prev_doc && (
                <Link
                  href={`/docs/${prev_doc.meta.slug}`}
                  className="btn btn-outline btn-size-default w-fit flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {prev_doc.meta.title}
                </Link>
              )}

              {next_doc && (
                <Link
                  href={`/docs/${next_doc.meta.slug}`}
                  className="btn btn-outline btn-size-default w-fit flex items-center ml-auto"
                >
                  {next_doc.meta.title}
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Link>
              )}
            </div>
          </article>
        </main>
      </div>
    );
  } catch (error) {
    console.error(`Error loading doc for slug: ${slug}`, error);
    notFound();
  }
}

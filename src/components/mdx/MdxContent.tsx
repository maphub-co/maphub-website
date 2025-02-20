import { mdxComponents } from "./MdxComponents";
import { compileMDX } from "next-mdx-remote/rsc";

interface MdxContentProps {
  source: any; // Using any here since the MDXRemoteProps type is causing issues
}

export default async function MdxContent({ source }: MdxContentProps) {
  const mdxSource = await compileMDX({
    source: source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false, // We've already parsed it with gray-matter
    },
  });

  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none
      prose-headings:scroll-m-20
      prose-headings:font-bold
      prose-a:text-primary
      prose-a:no-underline
      prose-a:font-normal
      hover:prose-a:underline
      prose-blockquote:border-l-primary
      prose-blockquote:border-l-4
      prose-blockquote:pl-4
      prose-blockquote:italic
      prose-code:px-1.5
      prose-code:py-0.5
      prose-code:rounded
      prose-code:bg-zinc-100
      prose-code:text-zinc-900
      dark:prose-code:bg-zinc-800
      dark:prose-code:text-zinc-100
      prose-code:before:content-none
      prose-code:after:content-none
      prose-pre:bg-zinc-950
      prose-pre:text-zinc-100
      dark:prose-pre:bg-zinc-900
      prose-pre:p-4
      prose-pre:rounded-lg
      prose-pre:border
      prose-pre:border-zinc-800
      dark:prose-pre:border-zinc-700
      prose-img:rounded-lg
      prose-img:mx-auto
      prose-img:my-6
      prose-ul:my-6
      prose-ul:list-disc
      prose-ul:pl-6
      prose-ol:my-6
      prose-ol:list-decimal
      prose-ol:pl-6
      prose-li:my-2
      prose-li:pl-1.5
      prose-li:marker:text-primary"
    >
      {mdxSource.content}
    </div>
  );
}

import React from "react";
import Image from "next/image";
import Link from "next/link";

// Utility function to generate slug from text
function generate_slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
}

interface ImageProps {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
}

interface LinkProps {
  href?: string;
  children?: React.ReactNode;
}

interface HeadingProps {
  children?: React.ReactNode;
  id?: string;
}

interface HighlightProps {
  children?: React.ReactNode;
}

interface ListProps {
  children?: React.ReactNode;
  className?: string;
}

const CustomImage = ({ src, alt, width, height }: ImageProps) => {
  if (!src) {
    return null;
  }

  // Convert width and height to numbers if they are strings
  const numericWidth = width
    ? typeof width === "string"
      ? parseInt(width, 10)
      : width
    : 800;
  const numericHeight = height
    ? typeof height === "string"
      ? parseInt(height, 10)
      : height
    : 500;

  return (
    <div className="my-6 relative">
      <Image
        src={src}
        alt={alt || ""}
        width={numericWidth}
        height={numericHeight}
        className="rounded-lg mx-auto"
      />
      {alt && (
        <span className="text-sm text-muted-foreground block text-center mt-2">
          {alt}
        </span>
      )}
    </div>
  );
};

const CustomLink = ({ href, children }: LinkProps) => {
  if (!children) {
    return null;
  }

  if (!href) {
    return <span className="text-primary">{children}</span>;
  }

  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (isInternal) {
    return (
      <Link href={href} className="text-primary hover:underline">
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      {children}
    </a>
  );
};

const CustomH1 = ({ children, id }: HeadingProps) => {
  if (!children) {
    return null;
  }

  // Generate ID from children text if not provided
  const heading_id = id || generate_slug(children.toString());

  return (
    <h1 id={heading_id} className="text-4xl font-bold mb-8 scroll-m-20">
      {children}
    </h1>
  );
};

const CustomH2 = ({ children, id }: HeadingProps) => {
  if (!children) {
    return null;
  }

  // Generate ID from children text if not provided
  const heading_id = id || generate_slug(children.toString());

  return (
    <h2 id={heading_id} className="text-2xl font-bold my-8 md:mb-4 scroll-m-20">
      {children}
    </h2>
  );
};

const CustomH3 = ({ children, id }: HeadingProps) => {
  if (!children) {
    return null;
  }

  // Generate ID from children text if not provided
  const heading_id = id || generate_slug(children.toString());

  return (
    <h3 id={heading_id} className="text-lg font-semibold my-4 pl-2 scroll-m-20">
      {children}
    </h3>
  );
};

const CustomH4 = ({ children, id }: HeadingProps) => {
  if (!children) {
    return null;
  }

  // Generate ID from children text if not provided
  const heading_id = id || generate_slug(children.toString());

  return (
    <h4
      id={heading_id}
      className="text-base font-semibold my-2 ml-4 scroll-m-20"
    >
      {children}
    </h4>
  );
};

const Blockquote = ({ children }: { children?: React.ReactNode }) => {
  if (!children) {
    return null;
  }

  return (
    <blockquote className="border-l-4 border-primary pl-4 italic my-6">
      {children}
    </blockquote>
  );
};

const Pre = (props: React.HTMLAttributes<HTMLPreElement>) => (
  <pre
    {...props}
    className="p-4 rounded-lg overflow-x-auto my-6 bg-zinc-950 dark:bg-zinc-900 text-zinc-100 border border-zinc-800 dark:border-zinc-700"
  />
);

const Code = (props: React.HTMLAttributes<HTMLElement>) => (
  <code
    {...props}
    className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5 rounded-md text-sm font-mono"
  />
);

const Highlight = ({ children }: HighlightProps) => {
  if (!children) {
    return null;
  }

  return (
    <div className="my-6 p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
      {children}
    </div>
  );
};

const UnorderedList = ({ children, className = "" }: ListProps) => {
  if (!children) {
    return null;
  }

  return (
    <ul className={`my-6 list-disc pl-6 space-y-2 ${className}`}>{children}</ul>
  );
};

const OrderedList = ({ children, className = "" }: ListProps) => {
  if (!children) {
    return null;
  }

  return (
    <ol className={`my-6 list-decimal pl-6 space-y-2 ${className}`}>
      {children}
    </ol>
  );
};

const ListItem = ({ children }: { children?: React.ReactNode }) => {
  if (!children) {
    return null;
  }

  return <li className="pl-2">{children}</li>;
};

export const mdxComponents = {
  h1: CustomH1,
  h2: CustomH2,
  h3: CustomH3,
  h4: CustomH4,
  a: CustomLink,
  img: CustomImage,
  Image: CustomImage,
  blockquote: Blockquote,
  pre: Pre,
  code: Code,
  Highlight: Highlight,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
};

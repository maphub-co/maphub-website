// LIBRARIES
import Script from "next/script";

/*======= INTERFACE =======*/
interface SchemaScriptProps {
  id: string;
  schema: Record<string, any>;
}

/*======= COMPONENT =======*/
export default function SchemaScript({ id, schema }: SchemaScriptProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

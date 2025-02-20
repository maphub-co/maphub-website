// LIBRARIES
import { get_all_docs_pages } from "@/lib/docs/mdx";
import { redirect } from "next/navigation";

/*======= COMPONENT =======*/
export default async function DocsHomePage() {
  try {
    const docs = await get_all_docs_pages();
    const first_page = docs[0];

    redirect(`/docs/${first_page.meta.slug}`);
  } catch (error: any) {
    throw error;
  }
}

import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ProfileNotFound() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
      <p className="text-muted-foreground mb-8">
        We couldn't find the profile you're looking for. It might have been
        removed or is no longer available.
      </p>
      <Button asChild>
        <Link href="/hub">Explore Maps</Link>
      </Button>
    </div>
  );
}

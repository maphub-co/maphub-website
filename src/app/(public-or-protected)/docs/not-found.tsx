import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DocNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-6">Documentation Not Found</h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-md mx-auto">
        The documentation page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/docs">
          Browse All Documentation
        </Link>
      </Button>
    </div>
  );
}
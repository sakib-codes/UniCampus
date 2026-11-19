import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-canvas text-fg">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-[20px] bg-surface border border-line text-center space-y-5 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 text-brand mx-auto flex items-center justify-center">
          <Compass className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs font-bold text-brand uppercase tracking-wider">
            404 • Resource Not Found
          </div>
          <h1 className="text-xl font-bold tracking-tight text-fg">
            Page does not exist
          </h1>
          <p className="text-xs text-fg-muted leading-relaxed">
            The destination you requested has been moved or does not exist on the UniCampus portal network.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/dashboard" className="w-full inline-block">
            <Button
              variant="primary"
              size="md"
              fullWidth
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Return to Portal Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


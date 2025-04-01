import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { usePWA } from "@/hooks/use-pwa";

export function UpdatePrompt() {
  const { updateServiceWorker } = usePWA();

  const handleUpdate = async () => {
    try {
      await updateServiceWorker();
      // Force reload the page to ensure the new version is used
      window.location.reload();
    } catch (error) {
      console.error("Failed to update service worker:", error);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-xs animate-in fade-in-50 slide-in-from-right-10">
      <Alert className="border-primary/20 shadow-md">
        <RefreshCw className="h-4 w-4 text-primary" />
        <AlertTitle>Update Available</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <span>A new version of this app is available.</span>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleUpdate}
          >
            Update Now
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
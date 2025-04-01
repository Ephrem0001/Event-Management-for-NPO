import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs animate-in fade-in-50 slide-in-from-right-10">
      <Alert className="border-destructive/20 shadow-md">
        <WifiOff className="h-4 w-4 text-destructive" />
        <AlertTitle>You're Offline</AlertTitle>
        <AlertDescription>
          <span>Some features may be limited until you reconnect.</span>
        </AlertDescription>
      </Alert>
    </div>
  );
}
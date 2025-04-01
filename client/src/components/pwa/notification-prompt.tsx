import { useState, useEffect } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BellRing, X } from "lucide-react";
import { usePWA } from "@/hooks/use-pwa";

export function NotificationPrompt() {
  const { notificationPermission, requestPushPermission } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Always show notification prompt for testing
  useEffect(() => {
    if (!dismissed) {
      // Set a very short delay to ensure the component is mounted properly
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [dismissed]);

  const handleRequestPermission = async () => {
    try {
      const permission = await requestPushPermission();
      if (permission === 'granted') {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error("Failed to request notification permission:", error);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
    // Remember that user has dismissed the prompt for 7 days
    localStorage.setItem("notification-prompt-dismissed", Date.now().toString());
  };

  // Clear the dismissed state if it's been more than 7 days
  useEffect(() => {
    const dismissedTime = localStorage.getItem("notification-prompt-dismissed");
    if (dismissedTime) {
      const dismissedDate = parseInt(dismissedTime, 10);
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      
      if (Date.now() - dismissedDate > sevenDaysInMs) {
        localStorage.removeItem("notification-prompt-dismissed");
      }
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed top-4 left-0 right-0 mx-auto max-w-md z-50 px-4 animate-in fade-in-50 slide-in-from-top-10">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-start mb-3">
          <div className="mr-3">
            <BellRing className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Enable Notifications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stay updated on volunteer opportunities, event changes, and important updates.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 -mt-1 -mr-1 h-8 w-8"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <Button 
            variant="outline" 
            onClick={handleDismiss}
            className="px-4"
          >
            Not now
          </Button>
          <Button 
            onClick={handleRequestPermission}
            className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-primary dark:hover:bg-primary/90 px-4"
          >
            Enable
          </Button>
        </div>
      </div>
    </div>
  );
}
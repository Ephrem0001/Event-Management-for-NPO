import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import { usePWA } from "@/hooks/use-pwa";
import { useIsMobile } from "@/hooks/use-mobile";
import { isRunningAsPWA } from "@/lib/pwa";

export function InstallPrompt() {
  const { isInstallable, installApp, isInstalled } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [browserInstallMessage, setBrowserInstallMessage] = useState("");
  const isMobile = useIsMobile();

  // Set browser-specific installation message
  useEffect(() => {
    // Determine browser type
    const isChrome = navigator.userAgent.includes('Chrome');
    const isEdge = navigator.userAgent.includes('Edg');
    const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    
    if (isChrome && !isEdge) {
      setBrowserInstallMessage("Click Install to add this app to your device. If nothing happens, click the install icon (⊕) in Chrome's address bar.");
    } else if (isEdge) {
      setBrowserInstallMessage("Click Install or use Edge's ... menu > Apps > Install this site as an app.");
    } else if (isSafari && isIOS) {
      setBrowserInstallMessage("Tap the Share button at the bottom of Safari, then 'Add to Home Screen'.");
    } else {
      setBrowserInstallMessage("Click Install to add this app to your device for offline access.");
    }
  }, []);

  // Show install prompt more quickly (after 1 second)
  useEffect(() => {
    // Always show the prompt for testing
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
    // Remember that user has dismissed the prompt for 7 days
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  const handleInstall = async () => {
    try {
      const installed = await installApp();
      if (installed) {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error("Failed to install app:", error);
    }
  };

  // Clear the dismissed state if it's been more than 7 days
  useEffect(() => {
    const dismissedTime = localStorage.getItem("pwa-install-dismissed");
    if (dismissedTime) {
      const dismissedDate = parseInt(dismissedTime, 10);
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      
      if (Date.now() - dismissedDate > sevenDaysInMs) {
        localStorage.removeItem("pwa-install-dismissed");
      }
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto max-w-md z-50 px-4 animate-in fade-in-50 slide-in-from-bottom-10">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Banner with app logo */}
        <div className="bg-gradient-to-r from-primary/80 to-primary p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-2 mr-3">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">Volunteer Hub</h3>
              <p className="text-white/90 text-sm">Fast, Offline Access</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 hover:text-white"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Main content */}
        <div className="p-4">
          <h4 className="font-medium mb-2">Install the app on your {isMobile ? "phone" : "device"}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {isMobile 
              ? "Add to your home screen for quick access even when offline. No app store required!" 
              : "Install on your desktop for faster loading, offline access, and a better experience."}
          </p>
          
          {/* Browser-specific install instructions */}
          <div className="bg-primary/10 p-3 rounded-md mb-4">
            <p className="text-sm text-primary-foreground">{browserInstallMessage}</p>
          </div>
          
          {/* Benefits */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm">
              <div className="w-5 h-5 mr-2 text-primary">✓</div>
              <span>Work offline, even without internet</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-5 h-5 mr-2 text-primary">✓</div>
              <span>Faster loading and better performance</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-5 h-5 mr-2 text-primary">✓</div>
              <span>Get real-time notifications</span>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={handleDismiss}
              className="flex-1"
            >
              Not now
            </Button>
            <Button 
              onClick={handleInstall}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

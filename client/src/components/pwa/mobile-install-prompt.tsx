import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/use-pwa";
import { useMobileInfo } from "@/hooks/use-mobile";
import { Download, X, Share2, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MobileInstallPrompt() {
  // Now we can use platform detection directly from usePWA
  const { 
    isInstallable, 
    installApp, 
    isInstalled, 
    isIOS, 
    isAndroid,
    isMobile 
  } = usePWA();
  
  const [dismissed, setDismissed] = useState(false);
  // Still need browser detection from useMobileInfo
  const { isSafari, isChrome } = useMobileInfo();
  const [isInstalling, setIsInstalling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user already dismissed the prompt in this session
    const sessionDismissed = sessionStorage.getItem("pwa-install-dismissed");
    if (sessionDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleInstall = async () => {
    try {
      setIsInstalling(true);
      
      // Show installing toast
      toast({
        title: "Installing...",
        description: "Installing the app on your device",
      });
      
      const success = await installApp();
      
      setIsInstalling(false);
      
      if (success) {
        toast({
          title: "Installation Complete! 🎉",
          description: "You can now use the app offline from your home screen.",
          duration: 6000,
        });
        setDismissed(true); // Hide prompt after successful install
      } else {
        // Show detailed platform and browser-specific instructions with icons
        // Show detailed instructions with proper string title/descriptions
        if (isIOS && isSafari) {
          toast({
            title: "iOS Safari Installation",
            description: "1. Tap Share (📤) → 2. Scroll to 'Add to Home Screen' → 3. Tap 'Add' to confirm",
            duration: 15000,
          });
        } else if (isIOS && isChrome) {
          toast({
            title: "iOS Chrome Installation",
            description: "1. Tap Menu (⋮) → 2. Select 'Add to Home Screen' → 3. Confirm by tapping 'Add'",
            duration: 15000,
          });
        } else if (isAndroid && isChrome) {
          toast({
            title: "Android Installation",
            description: "1. Tap Menu (⋮) → 2. Select 'Install app' → 3. Follow prompts to complete installation",
            duration: 15000,
          });
        } else if (isAndroid && !isChrome) {
          toast({
            title: "Android Browser Installation",
            description: "Open this site in Chrome for easier installation, or check your browser's menu for 'Add to Home screen'",
            duration: 12000,
          });
        } else {
          toast({
            title: "Install as App",
            description: "Look for 'Add to Home Screen' or 'Install' in your browser's menu to install this app",
            duration: 10000,
          });
        }
        
        // For iOS, show an additional tip after a delay
        if (isIOS) {
          setTimeout(() => {
            toast({
              title: "Installation Tip",
              description: "After installation: The app will appear on your home screen with a full-screen experience and offline capabilities",
              duration: 12000,
            });
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Error installing:", error);
      setIsInstalling(false);
      toast({
        title: "Installation Error",
        description: "There was a problem installing the app. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    // Remember the dismissal for this session
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!isMobile || !isInstallable || isInstalled || dismissed) {
    return null;
  }

  // Customize prompt based on mobile platform
  const promptTitle = isIOS ? 'Add to Home Screen' : 'Install App';
  const promptDesc = isIOS 
    ? 'Install for offline use and full-screen experience' 
    : 'Get quick access and offline features';
  
  // Customize the icon based on the platform
  const InstallIcon = isIOS ? Share2 : Download;
  
  return (
    <div className="pwa-install-prompt">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <InstallIcon size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">{promptTitle}</h3>
            <p className="text-xs text-muted-foreground">{promptDesc}</p>
          </div>
        </div>
        
        {/* Show device-specific hint */}
        {isIOS && (
          <p className="text-xs mt-2 ml-12 text-muted-foreground">
            <span className="font-semibold">Tip:</span> Use Safari for best experience
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDismiss}
          className="h-9 w-9 p-0 rounded-full"
          aria-label="Dismiss"
        >
          <X size={16} />
        </Button>
        
        <Button
          variant="default"
          size="sm"
          className="flex items-center gap-1.5 px-4 py-2 h-9 min-w-[120px] justify-center"
          onClick={handleInstall}
          disabled={isInstalling}
        >
          {isInstalling ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              <span>Installing...</span>
            </>
          ) : (
            <>
              <InstallIcon size={16} />
              <span>{isIOS ? 'Add to Home' : 'Install'}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
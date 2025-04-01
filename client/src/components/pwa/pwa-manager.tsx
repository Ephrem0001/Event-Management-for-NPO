import { InstallPrompt } from "./install-prompt";
import { NotificationPrompt } from "./notification-prompt";
import { UpdatePrompt } from "./update-prompt";
import { OfflineIndicator } from "./offline-indicator";
import { usePWA } from "@/hooks/use-pwa";

/**
 * PWAManager is a component that manages all PWA-related UI components.
 * It displays prompts for installation, updates, and notification permissions
 * as well as offline indicators.
 */
export function PWAManager() {
  const { 
    isUpdateAvailable,
    online
  } = usePWA();

  return (
    <>
      {/* All installation prompts have been removed */}
      
      {/* Show update prompt if an update is available */}
      {isUpdateAvailable && <UpdatePrompt />}
      
      {/* Show offline indicator if the user is offline */}
      {!online && <OfflineIndicator />}
    </>
  );
}
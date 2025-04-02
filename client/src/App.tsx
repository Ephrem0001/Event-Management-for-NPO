import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route } from "wouter";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { PWAProvider } from "./hooks/use-pwa";
import { PWAManager } from "./components/pwa/pwa-manager";
import MobileInstallPrompt from "./components/pwa/mobile-install-prompt";
import { useWebsocket } from "./hooks/use-websocket";

// Import components
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import EventsPage from "@/pages/events-page";
import EventDetails from "@/pages/event-details";
import CreateEvent from "@/pages/create-event";
import PublicProfile from "@/pages/public-profile";
import SettingsPage from "@/pages/settings-page";
import ManageVolunteers from "@/pages/manage-volunteers";
import MyEventsPage from "@/pages/my-events";
import MyRegistrationsPage from "@/pages/my-registrations";
import InvitationsPage from "@/pages/invitations";
import LandingPage from "@/pages/landing-page";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/navbar";

// Import Admin Pages
import AdminCategories from "@/pages/admin/categories";
import AdminVolunteers from "@/pages/admin/volunteers";
import AdminOrganizers from "@/pages/admin/organizers";
import AdminEvents from "@/pages/admin/events";
import AdminProfile from "@/pages/admin/profile";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Switch>
        {/* Landing Page Route - No Navbar */}
        <Route path="/" component={LandingPage} />
      
        {/* Admin Routes */}
        <ProtectedRoute path="/admin/categories" component={AdminCategories} />
        <ProtectedRoute path="/admin/volunteers" component={AdminVolunteers} />
        <ProtectedRoute path="/admin/organizers" component={AdminOrganizers} />
        <ProtectedRoute path="/admin/events" component={AdminEvents} />
        <ProtectedRoute path="/admin/profile/:id" component={AdminProfile} />

        {/* Regular Routes - All have Navbar */}
        <Route>
          {() => (
            <>
              <Navbar />
              <Switch>
                <Route path="/auth" component={AuthPage} />
                <ProtectedRoute path="/dashboard" component={HomePage} />
                <ProtectedRoute path="/events" component={EventsPage} />
                <ProtectedRoute path="/events/:id" component={EventDetails} />
                <ProtectedRoute path="/events/:id/manage" component={ManageVolunteers} />
                <ProtectedRoute path="/events/:id/edit" component={CreateEvent} />
                <ProtectedRoute path="/my-events" component={MyEventsPage} />
                <ProtectedRoute path="/my-registrations" component={MyRegistrationsPage} />
                <ProtectedRoute path="/invitations" component={InvitationsPage} />
                <ProtectedRoute path="/create-event" component={CreateEvent} />
                <ProtectedRoute path="/profile/:id" component={PublicProfile} />
                <ProtectedRoute path="/settings" component={SettingsPage} />
                <Route component={NotFound} />
              </Switch>
            </>
          )}
        </Route>
      </Switch>
    </div>
  );
}

// WebSocket connection wrapper
const WebSocketWrapper = ({ children }: { children: React.ReactNode }) => {
  // Initialize WebSocket connection 
  const websocketConnection = useWebsocket();
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PWAProvider>
          <WebSocketWrapper>
            <Router />
            <PWAManager />
            <MobileInstallPrompt />
            <Toaster />
          </WebSocketWrapper>
        </PWAProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
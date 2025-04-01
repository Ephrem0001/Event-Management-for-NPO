import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { useState } from "react";
import {
  Users,
  UserCog,
  CalendarCheck,
  LayoutGrid,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return <Redirect to="/" />;
  }

  const NavLinks = () => (
    <div className="space-y-1">
      <Link href="/admin/categories">
        <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
          <LayoutGrid className="h-4 w-4" />
          <span>Categories</span>
        </a>
      </Link>
      <Link href="/admin/volunteers">
        <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
          <Users className="h-4 w-4" />
          <span>Volunteers</span>
        </a>
      </Link>
      <Link href="/admin/organizers">
        <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
          <UserCog className="h-4 w-4" />
          <span>Event Creators</span>
        </a>
      </Link>
      <Link href="/admin/events">
        <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
          <CalendarCheck className="h-4 w-4" />
          <span>Event Moderation</span>
        </a>
      </Link>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold tracking-tight">Admin Dashboard</h2>
            <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-2">
            <NavLinks />
          </nav>

          <div className="border-t p-4">
            <button
              onClick={() => logoutMutation.mutate()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            className="fixed top-4 left-4 z-40"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] max-w-[300px] p-0">
          <div className="flex flex-col h-full bg-background">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Admin Dashboard</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
            </div>

            <nav className="flex-1 overflow-y-auto p-2">
              <NavLinks />
            </nav>

            <div className="border-t p-4">
              <button
                onClick={() => logoutMutation.mutate()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="md:hidden h-12" /> {/* Spacer for mobile menu button */}
        {children}
      </main>
    </div>
  );
}

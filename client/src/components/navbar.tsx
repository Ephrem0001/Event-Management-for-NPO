import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { usePWA } from "@/hooks/use-pwa";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Bell, Menu, X, Calendar, BookOpen, Plus, Home, Star, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const { notificationPermission, requestPushPermission } = usePWA();
  const { toast } = useToast();
  const [isEnablingNotifications, setIsEnablingNotifications] = useState(false);
  const [open, setOpen] = useState(false);

  const handleEnableNotifications = async () => {
    try {
      // Set loading state
      setIsEnablingNotifications(true);
      
      // Show requesting toast
      toast({
        title: "Requesting Permissions...",
        description: "Please allow notification permissions in the prompt",
      });
      
      const permission = await requestPushPermission();
      
      // Clear loading state
      setIsEnablingNotifications(false);
      
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You will now receive notifications for important events.",
          duration: 5000,
        });
      } else if (permission === 'denied') {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      
      // Clear loading state
      setIsEnablingNotifications(false);
      
      toast({
        title: "Notification Error",
        description: "There was a problem enabling notifications.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (!user) return null;
  
  const NavLink = ({ href, children, icon }: { href: string, children: React.ReactNode, icon?: React.ReactNode }) => (
    <Link href={href}>
      <a className="flex items-center py-3.5 px-1 text-sm font-medium hover:bg-muted rounded-md transition-colors">
        {icon && <span className="mr-3 text-muted-foreground">{icon}</span>}
        {children}
      </a>
    </Link>
  );
  
  return (
    <nav className="border-b sticky top-0 bg-background z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-base md:text-xl font-bold truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none">
                {user.role === 'volunteer' ? 'Volunteer Portal' : 'Event Manager'}
              </a>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="ml-4 lg:ml-10 hidden md:flex items-center space-x-2 lg:space-x-6">
              <Link href="/events">
                <a className="px-2 py-1 text-sm font-medium hover:bg-secondary rounded-md transition-colors">Events</a>
              </Link>
              {user.role === 'organizer' ? (
                <>
                  <Link href="/my-events">
                    <a className="px-2 py-1 text-sm font-medium hover:bg-secondary rounded-md transition-colors">My Events</a>
                  </Link>
                  <Link href="/create-event">
                    <a className="px-2 py-1 text-sm font-medium hover:bg-secondary rounded-md transition-colors">Create Event</a>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/my-registrations">
                    <a className="px-2 py-1 text-sm font-medium hover:bg-secondary rounded-md transition-colors">Registered Events</a>
                  </Link>
                  <Link href="/invitations">
                    <a className="px-2 py-1 text-sm font-medium hover:bg-secondary rounded-md transition-colors">Invitations</a>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Notifications Button - Only on Desktop */}
            {notificationPermission !== 'granted' && (
              <div className="hidden md:block">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex items-center gap-1 ${isEnablingNotifications ? 'bg-primary text-white' : 'border-primary/20 text-primary'}`}
                        onClick={handleEnableNotifications}
                        disabled={isEnablingNotifications}
                      >
                        {isEnablingNotifications ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                            <span className="hidden lg:inline">Enabling...</span>
                          </>
                        ) : (
                          <>
                            <Bell className="h-4 w-4" />
                            <span className="hidden lg:inline">Enable Notifications</span>
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get event notifications</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            
            {/* Mobile menu button */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[350px] pt-6 pb-0 px-0 overflow-hidden flex flex-col h-full">
                <div className="flex-1 overflow-y-auto px-4">
                  <div className="flex items-center justify-between mb-6 pt-2">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={user.avatar || ''} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">{user.name || user.username}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full" 
                      onClick={() => setOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Mobile Navigation Links */}
                  <div className="space-y-1 pb-6">
                    <NavLink href="/" icon={<Home className="h-4 w-4" />}>Home</NavLink>
                    <NavLink href="/events" icon={<Calendar className="h-4 w-4" />}>Events</NavLink>
                    
                    {user.role === 'organizer' ? (
                      <>
                        <NavLink href="/my-events" icon={<BookOpen className="h-4 w-4" />}>My Events</NavLink>
                        <NavLink href="/create-event" icon={<Plus className="h-4 w-4" />}>Create Event</NavLink>
                      </>
                    ) : (
                      <>
                        <NavLink href="/my-registrations" icon={<Star className="h-4 w-4" />}>My Registered Events</NavLink>
                        <NavLink href="/invitations" icon={<Mail className="h-4 w-4" />}>Invitations</NavLink>
                      </>
                    )}
                    
                    <NavLink href={`/profile/${user.id}`} icon={<User className="h-4 w-4" />}>Profile</NavLink>
                    <NavLink href="/settings" icon={<Settings className="h-4 w-4" />}>Settings</NavLink>
                    
                    {/* Notifications Button - Mobile Only */}
                    {notificationPermission !== 'granted' && (
                      <div className="pt-3 pb-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => {
                            handleEnableNotifications();
                            setOpen(false);
                          }}
                          disabled={isEnablingNotifications}
                        >
                          {isEnablingNotifications ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                              <span>Enabling Notifications...</span>
                            </>
                          ) : (
                            <>
                              <Bell className="h-4 w-4" />
                              <span>Enable Notifications</span>
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Logout in Mobile Menu - Fixed at bottom */}
                <div className="border-t px-4 py-4 mt-auto">
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {
                      logoutMutation.mutate();
                      setOpen(false);
                    }}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{logoutMutation.isPending ? 'Logging out...' : 'Log out'}</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* User Menu - Desktop only */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || ''} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="px-2 pt-1 pb-2">
                    <p className="text-sm font-medium truncate">{user.name || user.username}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.id}`}>
                      <a className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <a className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{logoutMutation.isPending ? 'Logging out...' : 'Log out'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface Notification {
    id: string;
    title: string;
    message: string;
    action_url: string | null;
    is_read: boolean;
    created_at: string;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    
    // Lazy load notifications only when dropdown opens or user is authenticated
    const fetchNotifications = useCallback(async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            setIsAuthenticated(false);
            return;
        }
        
        setIsAuthenticated(true);

        const { data } = await supabase
            .from('notifications')
            .select('id, title, message, action_url, is_read, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5); // Reduced from 10 for faster load

        if (data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        }
    }, []);

    // Check auth state on mount (lightweight)
    useEffect(() => {
        const supabase = createClient();
        
        // Use getSession instead of getUser - faster, no network call if cached
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session);
            if (session) {
                // Fetch notifications in background
                fetchNotifications();
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setIsAuthenticated(!!session);
            if (session) {
                fetchNotifications();
            } else {
                setNotifications([]);
                setUnreadCount(0);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchNotifications]);

    // Subscribe to realtime only when authenticated
    useEffect(() => {
        if (!isAuthenticated) return;

        const supabase = createClient();
        const channel = supabase
            .channel('notifications-bell')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
            }, (payload) => {
                const newNotification = payload.new as Notification;
                setNotifications(prev => [newNotification, ...prev].slice(0, 5));
                setUnreadCount(prev => prev + 1);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isAuthenticated]);

    const markAsRead = async (id: string) => {
        const supabase = createClient();
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // Don't render for unauthenticated users
    if (isAuthenticated === false) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">
                        No notification
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <DropdownMenuItem
                            key={notification.id}
                            className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${notification.is_read ? 'opacity-60' : 'bg-slate-50 dark:bg-slate-900'}`}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <div className="font-medium text-sm">{notification.title}</div>
                            <div className="text-xs text-slate-500 line-clamp-2">{notification.message}</div>
                            {notification.action_url && (
                                <Link href={notification.action_url} className="text-xs text-blue-600 hover:underline mt-1">
                                    View Details
                                </Link>
                            )}
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

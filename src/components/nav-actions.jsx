"use client"

import {
  LogOut,
  User
} from "lucide-react"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { useUser } from "@/contexts/UserProvider"
import { Link } from "react-router"

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { user, profileImage, handleLogout } = useUser();

  return (
    (<div className="flex items-center gap-2 text-sm">
      {/* <div className="hidden font-medium text-muted-foreground md:inline-block">
        Edit Oct 08
      </div> */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2">
            <p>{user?.firstName}</p>
            <Avatar className="h-8 w-8 cursor-pointer border">
              <AvatarImage src={profileImage} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-56 overflow-hidden rounded-lg p-0" align="end">
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
                <SidebarMenu className='p-2'>
                    <SidebarMenuItem >
                      <SidebarMenuButton asChild> 
                        <Link to={'/profile'} onClick={() => setIsOpen(false)}>
                          <User /> <span>Profilo</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem >
                      <SidebarMenuButton onClick={handleLogout}>
                        <LogOut /> <span>Logout</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>)
  );
}

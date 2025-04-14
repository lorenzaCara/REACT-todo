import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { NavLink } from "react-router";

export function NavMain({
  items
}) {
  return (
    (<SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <NavLink to={item.url} >
            {({ isActive }) => (
              <SidebarMenuButton isActive={isActive} className={cn(isActive && "bg-gray-100")}>
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          )}
          </NavLink>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>)
  );
}

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuSubItem,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "#/components";
import { LOGOUT_ROUTE, type SideBarItem } from "#/routes";
import { User, Settings, LogOut, Bell, ChevronsUpDown } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "#/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#/components/ui/accordion";
import { APP_NAME } from "#/configs";

const userMenuItems: ({ icon?: React.ElementType; label?: string; href?: string; variant?: "danger" } & {
  type?: "separator";
})[] = [
  {
    icon: LogOut,
    label: "退出登录",
    href: LOGOUT_ROUTE,
    variant: "danger"
  }
] as const;

function hasActiveSubItem(items: SideBarItem[], pathname: string): boolean {
  return items.some(
    item => (item.href && pathname.startsWith(item.href)) || (item.subMenu && hasActiveSubItem(item.subMenu, pathname))
  );
}

function SidebarList({ items, isSubmenu = false }: { items: SideBarItem[]; isSubmenu?: boolean }) {
  const location = useLocation();
  const pathname = location.pathname;

  const defaultOpenValues = items
    .filter(item => item.subMenu?.length && hasActiveSubItem(item.subMenu, pathname))
    .map(item => item.name);

  return (
    <Accordion
      type="multiple"
      className={cn("w-full space-y-1", isSubmenu && "ml-1 pl-1 border-l ")}
      defaultValue={defaultOpenValues}
    >
      {items.map(({ name, href, Icon, subMenu }) => {
        if (subMenu?.length) {
          const hasActiveChild = hasActiveSubItem(subMenu, pathname);

          return (
            <AccordionItem key={name} value={name} className="border-b-0">
              <AccordionTrigger
                className={cn(
                  "flex items-center justify-between py-2 px-3 text-sm font-medium rounded-md hover:no-underline",
                  "hover:bg-muted",
                  hasActiveChild ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0 pl-2">
                <SidebarList items={subMenu} isSubmenu />
              </AccordionContent>
            </AccordionItem>
          );
        }

        if (!href) return null;
        const isActive = !!href && (pathname === href || pathname.startsWith(href));

        return (
          <SidebarMenuSubItem key={name} className="list-none">
            <SidebarMenuButton asChild isActive={isActive} className="h-auto py-2 px-0 justify-start">
              <SidebarNavLink href={href} icon={Icon} name={name} isActive={isActive} />
            </SidebarMenuButton>
          </SidebarMenuSubItem>
        );
      })}
    </Accordion>
  );
}

interface AppSidebarProps {
  items: SideBarItem[];
  user: string;
}

export function AppSidebar({ items, user }: AppSidebarProps) {
  return (
    <Sidebar variant="floating" className="border-r shadow-sm">
      <SidebarHeader className="p-4 flex items-center">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{APP_NAME}</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-2">
        <SidebarList items={items} />
      </SidebarContent>
      <SidebarFooter className="border-t p-4 mt-auto">
        <UserProfile profile={user} menuItems={userMenuItems} />
      </SidebarFooter>
    </Sidebar>
  );
}

interface UserProfileProps {
  profile: string;
  menuItems: typeof userMenuItems;
}

function UserProfile({ profile, menuItems }: UserProfileProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between w-full cursor-pointer hover:bg-muted/50 rounded-md p-2 transition-colors">
          <div className="flex items-center gap-3">
            <Avatar className="border-2 border-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary">{profile.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{profile}</span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {menuItems.map((item, index) => {
          if (item.type === "separator") {
            return <DropdownMenuSeparator key={index} />;
          }

          if (!item.icon || !item.label) {
            return null;
          }

          const MenuItem = (
            <DropdownMenuItem
              key={index}
              className={cn("cursor-pointer", {
                "text-destructive hover:text-destructive/90 hover:bg-destructive/10": item.variant === "danger"
              })}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          );

          return item.href ? (
            <Link key={index} to={item.href} className="flex">
              {MenuItem}
            </Link>
          ) : (
            MenuItem
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarNavLink({
  href,
  icon: Icon,
  name,
  isActive
}: {
  href: string;
  icon: SideBarItem["Icon"];
  name: string;
  isActive: boolean;
}) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 text-sm py-2 px-3 rounded-md transition-colors",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
      <span>{name}</span>
    </Link>
  );
}

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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

// 用户菜单配置
const userMenuItems: ({ icon?: React.ElementType; label?: string; href?: string; variant?: "danger" } & {
  type?: "separator";
})[] = [
  {
    icon: User,
    label: "个人资料"
  },
  {
    icon: Settings,
    label: "账户设置"
  },
  {
    icon: Bell,
    label: "通知中心"
  },
  {
    type: "separator"
  },
  {
    icon: LogOut,
    label: "退出登录",
    href: LOGOUT_ROUTE,
    variant: "danger"
  }
] as const;

// 用户信息配置
const userProfile = {
  avatar: "https://avatars.githubusercontent.com/u/1000",
  name: "管理员",
  email: "admin@example.com"
};

export default function AppSidebar({ items }: { items: SideBarItem[] }) {
  return (
    <Sidebar variant="floating">
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarList items={items} />
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <UserProfile profile={userProfile} menuItems={userMenuItems} />
      </SidebarFooter>
    </Sidebar>
  );
}

function UserProfile({ profile, menuItems }: { profile: typeof userProfile; menuItems: typeof userMenuItems }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between w-full cursor-pointer hover:bg-muted/50 rounded-md p-1">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={profile.avatar} alt={`${profile.name}的头像`} />
              <AvatarFallback>{profile.name}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{profile.name}</span>
              <span className="text-xs text-muted-foreground">{profile.email}</span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4" />
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
                "text-red-500": item.variant === "danger"
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
  const content = (
    <span className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4" />
      <span>{name}</span>
    </span>
  );

  return isActive ? (
    content
  ) : (
    <Link
      to={href}
      className={cn("flex items-center gap-2 text-sm", {
        "text-muted-foreground": isActive
      })}
    >
      {content}
    </Link>
  );
}

function SidebarList({ items, isSubmenu = false }: { items: SideBarItem[]; isSubmenu?: boolean }) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      {items.map(({ name, href, Icon, subMenu }) => {
        const isActive = !!href && pathname.endsWith(href);

        if (subMenu?.length) {
          return (
            <SidebarGroup key={name}>
              <SidebarGroupLabel asChild>
                <span>{name}</span>
              </SidebarGroupLabel>
              <SidebarGroupContent className="border-l border-muted mt-1 px-2">
                <SidebarList items={subMenu} isSubmenu />
              </SidebarGroupContent>
            </SidebarGroup>
          );
        }

        if (!href) return null;

        return (
          <SidebarMenuSubItem key={name} className="list-none">
            <SidebarMenuButton asChild isActive={isActive}>
              <SidebarNavLink href={href} icon={Icon} name={name} isActive={isActive} />
            </SidebarMenuButton>
          </SidebarMenuSubItem>
        );
      })}
    </>
  );
}

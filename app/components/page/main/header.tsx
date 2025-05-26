import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "#/components/";
import { SidebarTrigger } from "#/components/";
import React from "react";
import { cn } from "#/lib/utils";
import { Link } from "react-router";

export type HeaderRoute = {
  name: string;
  href?: string;
};

interface HeaderProps {
  routes?: HeaderRoute[];
  className?: string;
  children?: React.ReactNode;
}

export function Header({ routes, className, children }: HeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 p-4 border-b bg-background pb-1", className)}>
      <div className="flex items-center gap-2">
        <SidebarTrigger className="border-2" />
        {routes && (
          <Breadcrumb>
            <BreadcrumbList>
              {routes.map(({ name, href }, index) => (
                <React.Fragment key={index}>
                  {index !== 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem key={index}>
                    {href ? (
                      <BreadcrumbLink asChild>
                        <Link to={href}>{name}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{name}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>

      <div className="flex">{children}</div>
    </div>
  );
}

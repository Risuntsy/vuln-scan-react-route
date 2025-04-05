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

export function Header({
  routes,
  children
}: {
  routes?: { name: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 p-4 border-b bg-background pb-1">
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
                      <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
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

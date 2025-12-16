import React from "react";
import { AppModel } from "../app-model";
import { Footer } from "../footer";
import { BackButton } from "./back-button";
import { BreadcrumbsTitle } from "./breadcrumbs-title";
import { Sidebar } from "./sidebar/sidebar";

export function Page({
  sidebar,
  children,
  app,
}: {
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
  app: AppModel;
}) {
  return (
    <div className="grow flex">
      <Sidebar>{sidebar}</Sidebar>

      <div className="grow flex flex-col pl-[60px] min-w-0 pr-4">
        <main className="grow mb-12">
          <BreadcrumbsTitle />

          <BackButton />

          {children}
        </main>

        <Footer app={app} />
      </div>
    </div>
  );
}

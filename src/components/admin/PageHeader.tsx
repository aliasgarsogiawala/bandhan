import React from "react";

export const PageHeader: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;

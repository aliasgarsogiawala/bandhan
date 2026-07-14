import React from "react";

export const PageHeader: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h1 className="text-2xl font-bold font-heading text-primary">{title}</h1>
      {description && <p className="text-sm text-foreground-muted mt-1">{description}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;

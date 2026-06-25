interface PageShellProps {
  title: string;
  description?: string;
  badge?: string;
  children: React.ReactNode;
}

export default function PageShell({
  title,
  description,
  badge,
  children,
}: PageShellProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        {badge && (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 mb-1">
            {badge}
          </span>
        )}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          {title}
        </h1>
        {description && (
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            {description}
          </p>
        )}
      </header>
      {children}
    </div>
  );
}

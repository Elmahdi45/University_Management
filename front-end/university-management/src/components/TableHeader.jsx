function TableHeader({
  title,
  description,
  children,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {children}
        </div>

      </div>
    </div>
  );
}

export default TableHeader;
function PageHeader({
  title,
  description,
  buttonText,
  onButtonClick,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-slate-500">
          {description}
        </p>
      </div>

      {buttonText && (
        <button
          onClick={onButtonClick}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
    
export default PageHeader;
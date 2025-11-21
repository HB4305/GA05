const FormSelect = ({ label, htmlFor, error, children }) => {
    return (
        <div className="space-y-2">
            <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
                {label}
            </label>
            <div className="relative">
                {children}
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="text-sm font-medium text-red-600 flex items-center gap-1">
                    <span>⚠</span> {error.message}
                </p>
            )}
        </div>
    );
};

export default FormSelect;

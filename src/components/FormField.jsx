const FormField = ({ label, htmlFor, error, children }) => {
    return (
        <div className="space-y-2">
            <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
                {label}
            </label>
            {children}
            {error && (
                <p className="text-sm font-medium text-red-600 flex items-center gap-1">
                    <span>⚠</span> {error.message}
                </p>
            )}
        </div>
    );
};

export default FormField;

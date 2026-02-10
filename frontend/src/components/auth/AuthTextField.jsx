function AuthTextField({
    id,
    name,
    label,
    type = 'text',
    placeholder,
    icon: Icon,
    register,
    error,
    autoComplete,
    rightElement,
}) {
    const inputName = name || id;
    const errorId = error ? `${id}-error` : undefined;
    const inputPadding = rightElement ? 'pr-11' : 'pr-4';

    return (
        <div>
            <label htmlFor={id} className="auth-label">
                {label}
            </label>
            <div className="relative">
                {Icon ? (
                    <Icon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                ) : null}
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    aria-invalid={Boolean(error)}
                    aria-describedby={errorId}
                    className={`auth-input ${Icon ? 'pl-11' : 'pl-4'} ${inputPadding}`}
                    {...register(inputName)}
                />
                {rightElement ? (
                    <div className="absolute right-3 top-3">{rightElement}</div>
                ) : null}
            </div>
            {error ? (
                <p id={errorId} className="mt-2 text-sm text-rose-500">
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export default AuthTextField;

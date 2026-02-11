const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = email => emailRegex.test(String(email || '').trim());

export const getPasswordIssues = password => {
    const issues = [];
    const value = String(password || '');

    if (value.length < 8) issues.push('at least 8 characters');
    if (!/[a-z]/.test(value)) issues.push('a lowercase letter');
    if (!/[A-Z]/.test(value)) issues.push('an uppercase letter');
    if (!/[0-9]/.test(value)) issues.push('a number');
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value))
        issues.push('a special character');

    return issues;
};

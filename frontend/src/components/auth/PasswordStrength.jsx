import { CheckCircle2, XCircle } from 'lucide-react';
import { passwordRules } from '../../lib/authValidation';

const strengthLabels = ['Poor', 'Weak', 'Good', 'Strong'];
const strengthColors = [
    'bg-slate-700',
    'bg-accent/50',
    'bg-accent/70',
    'bg-accent',
];

function getStrengthIndex(password) {
    const matches = passwordRules.filter(rule => rule.test(password)).length;

    if (matches >= 4) return 3;
    if (matches === 3) return 2;
    if (matches === 2) return 1;
    return 0;
}

function PasswordStrength({ password }) {
    const strengthIndex = getStrengthIndex(password);
    const label = strengthLabels[strengthIndex];

    return (
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
                <span>Strength</span>
                <span className="text-slate-300" aria-live="polite">
                    {label}
                </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
                {strengthLabels.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 rounded-full ${index <= strengthIndex
                            ? strengthColors[strengthIndex]
                            : 'bg-slate-800'
                            }`}
                    />
                ))}
            </div>
            <div className="mt-4 space-y-2 text-sm">
                {passwordRules.map(rule => {
                    const passes = rule.test(password);
                    const Icon = passes ? CheckCircle2 : XCircle;

                    return (
                        <div key={rule.label} className="flex items-center gap-2">
                            <Icon
                                className={passes ? 'text-accent' : 'text-slate-500'}
                                size={16}
                            />
                            <span className={passes ? 'text-slate-200' : 'text-slate-400'}>
                                {rule.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PasswordStrength;

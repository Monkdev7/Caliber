import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthTextField from '../components/auth/AuthTextField';
import PasswordStrength from '../components/auth/PasswordStrength';
import { passwordSchema } from '../lib/authValidation';

const resetSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your password.'),
    })
    .refine(values => values.password === values.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

function AuthResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [params] = useSearchParams();
    const token = params.get('token');
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(resetSchema),
        mode: 'onBlur',
    });

    const passwordValue = watch('password', '');

    const onSubmit = async values => {
        await new Promise(resolve => setTimeout(resolve, 150));
        console.info('Reset password submit', values, token);
    };

    return (
        <AuthLayout
            title="Set a new password"
            subtitle="Update your Caliber password to keep the job scrapping portal secure."
            footer={
                <p className="text-center text-sm text-slate-400">
                    Need another link?{' '}
                    <Link className="auth-link" to="/forgot-password">
                        Request a reset
                    </Link>
                </p>
            }
        >
            {!token ? (
                <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    Reset token missing or expired. Please request a new link.
                </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <AuthTextField
                    id="reset-password"
                    name="password"
                    label="New password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    icon={Lock}
                    autoComplete="new-password"
                    register={register}
                    error={errors.password?.message}
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowPassword(current => !current)}
                            className="text-slate-400 transition hover:text-slate-200"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                />

                <AuthTextField
                    id="reset-confirm-password"
                    name="confirmPassword"
                    label="Confirm password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    icon={Lock}
                    autoComplete="new-password"
                    register={register}
                    error={errors.confirmPassword?.message}
                />

                <PasswordStrength password={passwordValue} />

                <button className="auth-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Updating password
                        </span>
                    ) : (
                        'Update password'
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}

export default AuthResetPassword;

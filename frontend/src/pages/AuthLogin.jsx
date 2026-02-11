import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthSplitLayout from '../components/auth/AuthSplitLayout';
import AuthTextField from '../components/auth/AuthTextField';
import { login } from '../lib/auth';

const loginSchema = z.object({
    email: z.string().email('Enter a valid email address.'),
    password: z.string().min(1, 'Password is required.'),
});

function AuthLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [authError, setAuthError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
    });

    const onSubmit = async values => {
        try {
            setAuthError('');
            await login(values.email, values.password);

            // Redirect to dashboard after successful login
            navigate('/dashboard', { replace: true });
        } catch (error) {
            setAuthError(error.message || 'Login failed. Please try again.');
        }
    };

    return (
        <AuthSplitLayout
            title="Sign in"
            subtitle="Use your Caliber credentials to access the job scrapping portal."
            asideTitle="Welcome back"
            asideText="Review saved searches, track pipelines, and keep your Caliber workspace in sync across devices."
            asideFooter={
                <p className="text-sm text-slate-400">
                    New to Caliber?{' '}
                    <Link className="auth-link" to="/signup">
                        Create an account
                    </Link>
                </p>
            }
        >
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {authError ? (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                        {authError}
                    </div>
                ) : null}
                <AuthTextField
                    id="login-email"
                    name="email"
                    label="Email address"
                    type="email"
                    placeholder="name@company.com"
                    icon={Mail}
                    autoComplete="email"
                    register={register}
                    error={errors.email?.message}
                />

                <AuthTextField
                    id="login-password"
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    icon={Lock}
                    autoComplete="current-password"
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

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-slate-300">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-accent focus:ring-accent"
                        />
                        Remember me
                    </label>
                    <Link className="auth-link" to="/forgot-password">
                        Forgot password?
                    </Link>
                </div>

                <button className="auth-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Signing in
                        </span>
                    ) : (
                        'Sign in'
                    )}
                </button>
            </form>
        </AuthSplitLayout>
    );
}

export default AuthLogin;

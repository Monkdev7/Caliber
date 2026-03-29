import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthTextField from '../components/auth/AuthTextField';
import { requestPasswordReset } from '../lib/auth';

const forgotSchema = z.object({
    email: z.string().email('Enter a valid email address.'),
});

function AuthForgotPassword() {
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(forgotSchema),
        mode: 'onBlur',
    });

    const onSubmit = async values => {
        try {
            setSubmitError('');
            await requestPasswordReset(values.email);
            setSubmitSuccess(
                'If an account exists for this email, a reset link has been sent.',
            );
        } catch (error) {
            setSubmitSuccess('');
            setSubmitError(
                error.message || 'Unable to send reset link. Please try again.',
            );
        }
    };

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="We will email a reset link for your Caliber job scrapping portal account."
            footer={
                <p className="text-center text-sm text-slate-400">
                    Remembered your password?{' '}
                    <Link className="auth-link" to="/login">
                        Back to sign in
                    </Link>
                </p>
            }
        >
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {submitError ? (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                        {submitError}
                    </div>
                ) : null}

                {submitSuccess ? (
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                        {submitSuccess}
                    </div>
                ) : null}

                <AuthTextField
                    id="forgot-email"
                    name="email"
                    label="Email address"
                    type="email"
                    placeholder="name@company.com"
                    icon={Mail}
                    autoComplete="email"
                    register={register}
                    error={errors.email?.message}
                />

                <button className="auth-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Sending link
                        </span>
                    ) : (
                        'Send reset link'
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}

export default AuthForgotPassword;

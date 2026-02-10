import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import AuthSplitLayout from '../components/auth/AuthSplitLayout';
import AuthTextField from '../components/auth/AuthTextField';
import PasswordStrength from '../components/auth/PasswordStrength';
import { passwordSchema } from '../lib/authValidation';
import { mockSignup } from '../lib/auth';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Enter a valid email address.'),
  password: passwordSchema,
});

function AuthSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const passwordValue = watch('password', '');

  const onSubmit = async values => {
    // TEMPORARY: Mock authentication - replace with real API call
    try {
      await mockSignup(values.fullName, values.email, values.password);
      console.info('Signup successful (mock)', values.email);

      // Redirect to dashboard after successful signup
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Signup failed:', error);
      // TODO: Add error handling UI when backend is integrated
    }
  };

  return (
    <AuthSplitLayout
      title="Create your account"
      subtitle="Join Caliber to start using the job scrapping portal."
      asideTitle="Build a calmer job search"
      asideText="Save roles, monitor new listings, and keep your job scrapping workflow organized in Caliber."
      asideContent={
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500">
              <span>Trusted reviews</span>
              <span className="normal-case tracking-normal text-slate-400">
                4.8 average rating
              </span>
            </div>
            <div className="mt-4 grid gap-4 text-sm text-slate-300">
              <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
                <p className="text-slate-200">
                  “Caliber keeps every role and source tidy without noise.”
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Aanya P. · Talent Ops Lead
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
                <p className="text-slate-200">
                  “The clean review flow saves us hours each week.”
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Devon R. · Recruitment Partner
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Trusted by
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-medium text-slate-400">
              <span className="rounded-lg border border-slate-800 px-3 py-2 text-center">
                Northwind Teams
              </span>
              <span className="rounded-lg border border-slate-800 px-3 py-2 text-center">
                Atlas Hiring
              </span>
              <span className="rounded-lg border border-slate-800 px-3 py-2 text-center">
                Summit Labs
              </span>
              <span className="rounded-lg border border-slate-800 px-3 py-2 text-center">
                Harbor Group
              </span>
            </div>
          </div>
        </div>
      }
      asideFooter={
        <p className="text-sm text-slate-400">
          Already have an account?{' '}
          <Link className="auth-link" to="/login">
            Sign in
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <AuthTextField
          id="signup-name"
          name="fullName"
          label="Full name"
          placeholder="Your name"
          icon={User}
          autoComplete="name"
          register={register}
          error={errors.fullName?.message}
        />

        <AuthTextField
          id="signup-email"
          name="email"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          icon={Mail}
          autoComplete="email"
          register={register}
          error={errors.email?.message}
        />

        <AuthTextField
          id="signup-password"
          name="password"
          label="Password"
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

        <PasswordStrength password={passwordValue} />

        <button className="auth-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Creating account
            </span>
          ) : (
            'Create account'
          )}
        </button>

        <p className="text-center text-xs text-slate-500">
          By creating an account, you agree to the Caliber privacy policy.
        </p>
      </form>
    </AuthSplitLayout>
  );
}

export default AuthSignup;

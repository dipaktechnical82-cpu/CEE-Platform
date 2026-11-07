'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CircleAlert, Eye, EyeOff, MailCheck, ShieldCheck } from 'lucide-react';
import { ApiClientError } from '@/lib/api-client';
import { authApi } from '@/lib/auth-api';

type FieldErrors = Partial<
  Record<'fullName' | 'email' | 'password' | 'passwordConfirmation', string>
>;

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: string;
  hint?: string;
  required?: boolean;
  onBlur?: () => void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getFieldErrors(error: unknown): FieldErrors {
  if (!(error instanceof ApiClientError) || !isRecord(error.details)) {
    return {};
  }

  const fieldErrors: FieldErrors = {};
  const fields: (keyof FieldErrors)[] = ['fullName', 'email', 'password', 'passwordConfirmation'];

  for (const field of fields) {
    const detail = error.details[field];
    if (typeof detail === 'string') {
      fieldErrors[field] = detail;
    } else if (Array.isArray(detail) && typeof detail[0] === 'string') {
      fieldErrors[field] = detail.join(' ');
    }
  }
  return fieldErrors;
}

function requestError(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError) {
    if (error.status === 429) {
      return 'Too many attempts. Please wait a moment before trying again.';
    }
    if (error.status >= 500 || error.status === 0) {
      return 'The secure account service is temporarily unavailable. Please try again shortly.';
    }
    return error.message || fallback;
  }
  return fallback;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
  hint,
  required = true,
  onBlur,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const messageId = `${id}-message`;

  return (
    <div className="auth-field">
      <label className="auth-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="auth-field__control">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? messageId : undefined}
          className="auth-field__input auth-field__input--password"
        />
        <button
          type="button"
          className="auth-field__toggle"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
        </button>
      </div>
      {error ? (
        <p id={messageId} className="auth-field__error">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="auth-field__hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: string;
  placeholder?: string;
  required?: boolean;
  onBlur?: () => void;
}

function TextField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
  required = true,
  onBlur,
}: TextFieldProps) {
  const messageId = `${id}-error`;

  return (
    <div className="auth-field">
      <label className="auth-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? messageId : undefined}
        className="auth-field__input"
      />
      {error ? (
        <p id={messageId} className="auth-field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FormAlert({ children, success = false }: { children: ReactNode; success?: boolean }) {
  return (
    <div
      className={`auth-form__alert${success ? ' auth-form__alert--success' : ''}`}
      role={success ? 'status' : 'alert'}
      aria-live={success ? 'polite' : 'assertive'}
    >
      {success ? (
        <ShieldCheck size={16} aria-hidden="true" />
      ) : (
        <CircleAlert size={16} aria-hidden="true" />
      )}
      <span>{children}</span>
    </div>
  );
}

function SubmitButton({ children, loading }: { children: string; loading: boolean }) {
  return (
    <button className="auth-submit" type="submit" disabled={loading} aria-busy={loading}>
      {loading ? (
        <>
          <span className="auth-submit__spinner" aria-hidden="true" />
          Please wait
        </>
      ) : (
        <>
          {children}
          <ArrowRight size={17} aria-hidden="true" />
        </>
      )}
    </button>
  );
}

function AuthHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header>
      <p className="auth-form__eyebrow">{eyebrow}</p>
      <h2 className="auth-form__title">{title}</h2>
      <p className="auth-form__subtitle">{subtitle}</p>
    </header>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors: FieldErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = email.trim() ? 'Enter a valid email address.' : 'Enter your email address.';
    }
    if (!password) errors.password = 'Enter your password.';
    setFieldErrors(errors);
    setFormError('');
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const { user } = await authApi.login({ email: email.trim(), password });
      router.replace(
        user.role === 'SUPER_ADMIN'
          ? '/dashboard'
          : user.role === 'INSTITUTION_ADMIN'
            ? '/dashboard/organizations'
            : user.role === 'STUDENT'
              ? '/student/dashboard'
              : '/',
      );
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        setFormError(
          "We couldn't sign you in. Check your email and password, and make sure your email is verified.",
        );
      } else {
        setFormError(requestError(error, 'We could not sign you in. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AuthHeading
        eyebrow="Your learning space"
        title="Welcome Back"
        subtitle="Your next breakthrough starts here."
      />
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <TextField
          id="login-email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(value) => {
            setEmail(value);
            setFieldErrors((current) => ({ ...current, email: undefined }));
          }}
          error={fieldErrors.email}
          onBlur={() => {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
              setFieldErrors((current) => ({
                ...current,
                email: email.trim() ? 'Enter a valid email address.' : 'Enter your email address.',
              }));
          }}
        />
        <PasswordField
          id="login-password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setFieldErrors((current) => ({ ...current, password: undefined }));
          }}
          error={fieldErrors.password}
          onBlur={() => {
            if (!password)
              setFieldErrors((current) => ({ ...current, password: 'Enter your password.' }));
          }}
        />
        <div className="auth-form__row">
          <Link href="/auth/forgot-password" className="auth-inline-link">
            Forgot password?
          </Link>
        </div>
        {formError ? <FormAlert>{formError}</FormAlert> : null}
        <SubmitButton loading={loading}>Sign In</SubmitButton>
      </form>
      <div className="auth-form__divider">NEW TO CEE MEDICAL PREP?</div>
      <p className="auth-form__footer">
        Begin your preparation
        <Link href="/register" className="auth-inline-link">
          Create an account
        </Link>
      </p>
      {formError ? (
        <p className="auth-form__footer auth-form__footer--spaced">
          Need a verification email?{' '}
          <Link href="/auth/verify-email" className="auth-inline-link">
            Resend it securely
          </Link>
        </p>
      ) : null}
    </>
  );
}

type RegisterFields = {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

function validateRegisterField(field: keyof RegisterFields, values: RegisterFields): string {
  if (field === 'fullName') {
    return values.fullName.trim() ? '' : 'Enter your full name.';
  }
  if (field === 'email') {
    if (!values.email.trim()) return 'Enter your email address.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
      ? ''
      : 'Enter a valid email address.';
  }
  if (field === 'password') {
    if (!values.password) return 'Create a password.';
    return values.password.length >= 10 ? '' : 'Use at least 10 characters.';
  }
  if (!values.passwordConfirmation) return 'Confirm your password.';
  return values.password === values.passwordConfirmation ? '' : 'Passwords do not match.';
}

export function RegisterForm() {
  const [values, setValues] = useState<RegisterFields>({
    fullName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof RegisterFields, boolean>>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const passwordRules = useMemo(
    () => [
      { label: 'At least 10 characters', met: values.password.length >= 10 },
      {
        label: 'Not entirely numeric',
        met: Boolean(values.password) && !/^\d+$/.test(values.password),
      },
    ],
    [values.password],
  );

  function updateField(field: keyof RegisterFields, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    setFormError('');
    if (touched[field]) {
      setFieldErrors((current) => ({
        ...current,
        [field]: validateRegisterField(field, next) || undefined,
      }));
    }
    if (field === 'password' && touched.passwordConfirmation) {
      setFieldErrors((current) => ({
        ...current,
        passwordConfirmation: validateRegisterField('passwordConfirmation', next) || undefined,
      }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = Object.keys(values) as (keyof RegisterFields)[];
    const errors = Object.fromEntries(
      fields.map((field) => [field, validateRegisterField(field, values)]),
    ) as FieldErrors;
    setTouched({ fullName: true, email: true, password: true, passwordConfirmation: true });
    setFieldErrors(errors);
    setFormError('');
    if (Object.values(errors).some(Boolean)) return;

    setLoading(true);
    try {
      const response = await authApi.register({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      });
      if (!response.verificationRequired) {
        setFormError('Your account could not be created. Please try again.');
        return;
      }
      setRegisteredEmail(values.email.trim());
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setFormError(
        error instanceof ApiClientError && error.status === 400
          ? 'Please review the highlighted fields and try again.'
          : requestError(
              error,
              'We could not create your account. Please review your details and retry.',
            ),
      );
    } finally {
      setLoading(false);
    }
  }

  if (registeredEmail) {
    return (
      <div className="auth-success">
        <span className="auth-success__icon">
          <MailCheck size={23} strokeWidth={1.7} aria-hidden="true" />
        </span>
        <div>
          <p className="auth-form__eyebrow">One last step</p>
          <h2 className="auth-form__title">Check your inbox</h2>
        </div>
        <p className="auth-success__copy">
          We sent a verification link to <strong>{registeredEmail}</strong>. Verify your email to
          activate your student account and sign in.
        </p>
        <div className="auth-success__actions">
          <Link
            href={`/auth/verify-email?email=${encodeURIComponent(registeredEmail)}`}
            className="auth-submit"
          >
            Continue to verification <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link href="/login" className="auth-inline-link">
            Return to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthHeading
        eyebrow="A better way to prepare"
        title="Begin Your Medical Journey"
        subtitle="Create your account and take the first step towards your CEE preparation."
      />
      <form className="auth-form auth-form--register" onSubmit={handleSubmit} noValidate>
        <TextField
          id="register-full-name"
          label="Full Name"
          autoComplete="name"
          placeholder="Your full name"
          value={values.fullName}
          onChange={(value) => updateField('fullName', value)}
          error={fieldErrors.fullName}
          onBlur={() => {
            setTouched((current) => ({ ...current, fullName: true }));
            setFieldErrors((current) => ({
              ...current,
              fullName: validateRegisterField('fullName', values) || undefined,
            }));
          }}
        />
        <TextField
          id="register-email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={(value) => updateField('email', value)}
          error={fieldErrors.email}
          onBlur={() => {
            setTouched((current) => ({ ...current, email: true }));
            setFieldErrors((current) => ({
              ...current,
              email: validateRegisterField('email', values) || undefined,
            }));
          }}
        />
        <PasswordField
          id="register-password"
          label="Password"
          autoComplete="new-password"
          value={values.password}
          onChange={(value) => updateField('password', value)}
          error={fieldErrors.password}
          onBlur={() => {
            setTouched((current) => ({ ...current, password: true }));
            setFieldErrors((current) => ({
              ...current,
              password: validateRegisterField('password', values) || undefined,
            }));
          }}
        />
        <ul className="auth-password-rules" aria-label="Password requirements">
          {passwordRules.map((rule) => (
            <li key={rule.label} className={rule.met ? 'is-met' : undefined}>
              {rule.label}
            </li>
          ))}
          <li>Avoid common passwords or personal details</li>
        </ul>
        <PasswordField
          id="register-password-confirmation"
          label="Confirm Password"
          autoComplete="new-password"
          value={values.passwordConfirmation}
          onChange={(value) => updateField('passwordConfirmation', value)}
          error={fieldErrors.passwordConfirmation}
          onBlur={() => {
            setTouched((current) => ({ ...current, passwordConfirmation: true }));
            setFieldErrors((current) => ({
              ...current,
              passwordConfirmation:
                validateRegisterField('passwordConfirmation', values) || undefined,
            }));
          }}
        />
        {formError ? <FormAlert>{formError}</FormAlert> : null}
        <SubmitButton loading={loading}>Create My Account</SubmitButton>
      </form>
      <div className="auth-form__divider">ALREADY A CEE MEDICAL PREP STUDENT?</div>
      <p className="auth-form__footer">
        Already have an account?
        <Link href="/login" className="auth-inline-link">
          Sign In
        </Link>
      </p>
    </>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword({ email: email.trim() });
      setSent(true);
    } catch (requestFailure) {
      setError(
        requestError(requestFailure, 'We could not process your request. Please try again.'),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AuthHeading
        eyebrow="Account recovery"
        title={sent ? 'Check your inbox' : 'Reset your password'}
        subtitle={
          sent
            ? 'If an eligible account matches that email, password reset instructions are on their way.'
            : 'Enter the email address linked to your account. We will send a secure reset link if it is eligible.'
        }
      />
      {sent ? (
        <div className="auth-success">
          <span className="auth-success__icon">
            <MailCheck size={23} strokeWidth={1.7} aria-hidden="true" />
          </span>
          <FormAlert success>
            For your privacy, we do not reveal whether an account exists for this address.
          </FormAlert>
          <Link href="/login" className="auth-submit">
            Return to sign in <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <form className="auth-form auth-form--compact" onSubmit={handleSubmit} noValidate>
          <TextField
            id="recovery-email"
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(value) => setEmail(value)}
            error={error && error.includes('valid email') ? error : undefined}
          />
          {error && !error.includes('valid email') ? <FormAlert>{error}</FormAlert> : null}
          <SubmitButton loading={loading}>Send Reset Link</SubmitButton>
          <p className="auth-form__footer">
            Remember your password?
            <Link href="/login" className="auth-inline-link">
              Sign In
            </Link>
          </p>
        </form>
      )}
    </>
  );
}

export function ResetPasswordForm() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    setToken(fragment.get('token'));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors: FieldErrors = {};
    if (password.length < 10) errors.password = 'Use at least 10 characters.';
    if (!confirmation) errors.passwordConfirmation = 'Confirm your password.';
    else if (password !== confirmation) errors.passwordConfirmation = 'Passwords do not match.';
    setFieldErrors(errors);
    setFormError('');
    if (!token) {
      setFormError(
        'This reset link is missing its security token. Request a new link to continue.',
      );
      return;
    }
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const result = await authApi.resetPassword({
        token,
        password,
        passwordConfirmation: confirmation,
      });
      if (!result.passwordReset) {
        setFormError('Your password could not be reset. Request a new link and try again.');
        return;
      }
      setComplete(true);
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setFormError(
        error instanceof ApiClientError && error.status === 400
          ? 'This reset link is invalid or expired. Request a new one to continue.'
          : requestError(error, 'We could not reset your password. Please try again.'),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AuthHeading
        eyebrow="Secure account recovery"
        title={complete ? 'Password updated' : 'Choose a new password'}
        subtitle={
          complete
            ? 'Your password has been changed. You can now securely sign in.'
            : 'Create a new password to get back to your CEE preparation.'
        }
      />
      {complete ? (
        <div className="auth-success">
          <span className="auth-success__icon">
            <ShieldCheck size={23} strokeWidth={1.7} aria-hidden="true" />
          </span>
          <Link href="/login" className="auth-submit">
            Sign in with new password <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      ) : token === null ? (
        <p className="auth-form__footer">Preparing your secure reset link…</p>
      ) : !token ? (
        <div className="auth-success">
          <FormAlert>This link is missing its security token or has expired.</FormAlert>
          <Link href="/auth/forgot-password" className="auth-submit">
            Request a new reset link <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <form className="auth-form auth-form--compact" onSubmit={handleSubmit} noValidate>
          <PasswordField
            id="reset-password"
            label="New Password"
            autoComplete="new-password"
            value={password}
            onChange={(value) => setPassword(value)}
            error={fieldErrors.password}
            hint="Use at least 10 characters. Avoid common or numeric-only passwords."
          />
          <PasswordField
            id="reset-password-confirmation"
            label="Confirm New Password"
            autoComplete="new-password"
            value={confirmation}
            onChange={(value) => setConfirmation(value)}
            error={fieldErrors.passwordConfirmation}
          />
          {formError ? <FormAlert>{formError}</FormAlert> : null}
          <SubmitButton loading={loading}>Update Password</SubmitButton>
        </form>
      )}
    </>
  );
}

export function VerifyEmailForm() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const actionToken = fragment.get('token');
    const emailFromLink = new URLSearchParams(window.location.search).get('email');
    setToken(actionToken);
    if (emailFromLink) setEmail(emailFromLink);
  }, []);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setError('This verification link is missing its security token. Request a new one below.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await authApi.verifyEmail({ token });
      setVerified(response.verified);
    } catch (requestFailure) {
      setError(
        requestFailure instanceof ApiClientError && requestFailure.status === 400
          ? 'This verification link is invalid or expired. Request a new one below.'
          : requestError(requestFailure, 'We could not verify this email. Please try again.'),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.resendVerification({ email: email.trim() });
      setSent(true);
    } catch (requestFailure) {
      setError(
        requestError(requestFailure, 'We could not process your request. Please try again.'),
      );
    } finally {
      setLoading(false);
    }
  }

  if (verified) {
    return (
      <>
        <AuthHeading
          eyebrow="Email confirmed"
          title="You're ready to begin"
          subtitle="Your email is verified. Sign in to continue your medical preparation."
        />
        <div className="auth-success">
          <span className="auth-success__icon">
            <ShieldCheck size={23} strokeWidth={1.7} aria-hidden="true" />
          </span>
          <Link href="/login" className="auth-submit">
            Continue to sign in <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </>
    );
  }

  if (token) {
    return (
      <>
        <AuthHeading
          eyebrow="Confirm your email"
          title="Verify your account"
          subtitle="Confirm this secure link to activate your CEE Medical Prep student account."
        />
        <form className="auth-form auth-form--compact" onSubmit={handleVerify}>
          {error ? <FormAlert>{error}</FormAlert> : null}
          <SubmitButton loading={loading}>Verify Email</SubmitButton>
          <p className="auth-form__footer">
            Link expired?
            <Link href="/auth/verify-email" className="auth-inline-link">
              Request another
            </Link>
          </p>
        </form>
      </>
    );
  }

  return (
    <>
      <AuthHeading
        eyebrow="Email verification"
        title={sent ? 'Check your inbox' : 'Resend verification'}
        subtitle={
          sent
            ? 'If your account is eligible, a fresh verification link will arrive shortly.'
            : 'Enter your email and we will send a new verification link if your account needs one.'
        }
      />
      {sent ? (
        <div className="auth-success">
          <span className="auth-success__icon">
            <MailCheck size={23} strokeWidth={1.7} aria-hidden="true" />
          </span>
          <FormAlert success>
            For your privacy, we do not reveal whether an account exists for this address.
          </FormAlert>
          <Link href="/login" className="auth-submit">
            Return to sign in <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <form className="auth-form auth-form--compact" onSubmit={handleResend} noValidate>
          <TextField
            id="verification-email"
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(value) => setEmail(value)}
          />
          {error ? <FormAlert>{error}</FormAlert> : null}
          <SubmitButton loading={loading}>Resend Verification Link</SubmitButton>
          <p className="auth-form__footer">
            Already verified?
            <Link href="/login" className="auth-inline-link">
              Sign In
            </Link>
          </p>
        </form>
      )}
    </>
  );
}

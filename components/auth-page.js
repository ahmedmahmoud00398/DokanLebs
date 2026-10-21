'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/lib/store-services';
import { useSiteLanguage } from '@/lib/use-site-language';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage({ mode }) {
  const { isArabic } = useSiteLanguage();
  const text = (english, arabic) => isArabic ? arabic : english;
  const [values, setValues] = useState({ firstName: '', lastName: '', phone: '', email: '', password: '', confirmation: '', terms: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const isSignup = mode === 'signup';
  const isForgot = mode === 'forgot-password';

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!values.email.trim()) return setError(text('Enter your email address.', 'أدخل بريدك الإلكتروني.'));
    if (!emailPattern.test(values.email)) return setError(text('Enter a valid email address.', 'أدخل بريدًا إلكترونيًا صحيحًا.'));
    if (!isForgot && !values.password) return setError(text('Enter your password.', 'أدخل كلمة المرور.'));
    if (isSignup && (!values.firstName.trim() || !values.lastName.trim() || !values.phone.trim())) return setError(text('Enter your first name, last name, and phone number.', 'أدخل الاسم الأول واسم العائلة ورقم الهاتف.'));
    if (isSignup && !values.terms) return setError(text('Please accept the Terms & Conditions.', 'يرجى الموافقة على الشروط والأحكام.'));
    if ((isSignup || (!isForgot && mode === 'login')) && values.password.length < 8) {
      return setError(text('Use at least 8 characters for your password.', 'يجب ألا تقل كلمة المرور عن 8 أحرف.'));
    }
    if (isSignup && values.password !== values.confirmation) return setError(text('Passwords do not match.', 'كلمتا المرور غير متطابقتين.'));

    setLoading(true);
    try {
      if (isForgot) await authService.requestPasswordReset(values.email);
      else if (isSignup) await authService.register({ name: `${values.firstName.trim()} ${values.lastName.trim()}`, phone: values.phone.trim(), email: values.email, password: values.password });
      else await authService.login({ email: values.email, password: values.password });
      setMessage(text('Request completed.', 'تم إرسال الطلب بنجاح.'));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : text('This service is unavailable right now.', 'الخدمة غير متاحة حاليًا.'));
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.signInWithGoogle();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : text('Google sign-in is unavailable right now.', 'تسجيل الدخول عبر Google غير متاح حاليًا.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'} className="auth-page grid min-h-[100vh] place-items-center bg-[#f1f1ef] px-5 py-9 max-[820px]:px-[18px] max-[700px]:px-3 max-[700px]:py-4">
      <section className="grid min-h-full w-full max-w-[1120px] grid-cols-2 gap-7 rounded-[20px] bg-white p-3 max-[820px]:min-h-0 max-[700px]:block max-[700px]:p-2" aria-labelledby="auth-title">
        <div className="flex min-h-[620px] items-center justify-center gap-[18px] overflow-hidden rounded-[14px] bg-[linear-gradient(145deg,#e4e5e4,#cfd1d0)] max-[820px]:min-h-[500px] max-[700px]:hidden" aria-label={text('Dokan Lebss clothing accessories', 'دوكان اللبس للملابس والإكسسوارات')}>
          <span className="flex h-[78%] w-[43%] rotate-[10deg] flex-col justify-between bg-[#f8f8f6] p-6 text-[#111] shadow-[0_18px_35px_#0003]">
            <strong className="text-[clamp(25px,4vw,52px)] leading-[.85]">DOKAN<br />LEBSS</strong>
            <small className="text-xs leading-[1.8] tracking-[2px]">{text('CLOTHING · SHOES', 'ملابس · أحذية')}<br />{text('ACCESSORIES', 'إكسسوارات')}</small>
            <b className="text-[10px] tracking-[2px]">{text('WEAR YOUR VIBE', 'ارتدِ ما يعبر عنك')}</b>
          </span>
          <span className="flex h-[78%] w-[43%] rotate-[5deg] flex-col justify-between bg-[#111] p-6 text-white shadow-[0_18px_35px_#0003]">
            <strong className="text-[clamp(25px,4vw,52px)] leading-[.85]">DOKAN<br />LEBSS</strong>
            <small className="text-xs leading-[1.8] tracking-[2px]">{text('SPRING 26', 'ربيع 26')}<br />{text('WINTER 26', 'شتاء 26')}</small>
          </span>
        </div>
        <div className="flex flex-col justify-center px-[clamp(20px,4vw,56px)] py-7 max-[700px]:px-3 max-[700px]:py-[22px]">
        <Link className="w-fit text-2xl text-[#111]" href="/" aria-label={text('Back to home', 'العودة إلى الرئيسية')}>{isArabic ? '→' : '←'}</Link>
        <h1 className="my-2 text-[34px] max-[700px]:text-[28px]" id="auth-title">{isForgot ? text('Forgot password', 'نسيت كلمة المرور') : isSignup ? text('Create an account', 'إنشاء حساب') : text('Log in', 'تسجيل الدخول')}</h1>
        {isSignup && <p className="mb-5 text-[13px]">{text('Already have an account?', 'لديك حساب بالفعل؟')} <Link className="text-[#111] underline" href="/login">{text('Log in', 'تسجيل الدخول')}</Link></p>}
        {mode === 'login' && <button className="outline-button min-h-[44px] w-full" type="button" onClick={google} disabled={loading}>{text('Continue with Google', 'المتابعة باستخدام Google')}</button>}
        {!isForgot && mode === 'login' && <p className="text-[13px]">{text('or continue with email', 'أو المتابعة باستخدام البريد الإلكتروني')}</p>}
        <form className="grid gap-[14px]" onSubmit={submit} noValidate>
          {isSignup && <div className="grid grid-cols-2 gap-3 max-[700px]:gap-2"><label className="grid gap-[7px] text-[13px]">{text('First Name', 'الاسم الأول')}<input className="min-h-[42px] w-full rounded-lg border border-[#ddd] px-3" autoComplete="given-name" placeholder={text('First Name', 'الاسم الأول')} value={values.firstName} onChange={(event) => setValues({ ...values, firstName: event.target.value })} required /></label><label className="grid gap-[7px] text-[13px]">{text('Last Name', 'اسم العائلة')}<input className="min-h-[42px] w-full rounded-lg border border-[#ddd] px-3" autoComplete="family-name" placeholder={text('Last Name', 'اسم العائلة')} value={values.lastName} onChange={(event) => setValues({ ...values, lastName: event.target.value })} required /></label></div>}
          <label className="grid gap-[7px] text-[13px]">{text('Email', 'البريد الإلكتروني')}<input dir="ltr" className="min-h-[42px] w-full rounded-lg border border-[#ddd] px-3" type="email" autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required /></label>
          {isSignup && <label className="grid gap-[7px] text-[13px]">{text('Phone Number', 'رقم الهاتف')}<div dir="ltr" className="flex items-center gap-[10px] rounded-lg border border-[#ddd] px-[10px]"><span>+20</span><input className="min-h-[42px] w-full border-0 px-3" type="tel" autoComplete="tel-national" placeholder={text('Phone Number', 'رقم الهاتف')} value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} required /></div></label>}
          {!isForgot && <label className="grid gap-[7px] text-[13px]">{text('Password', 'كلمة المرور')}<div className="password-field"><input dir={isArabic ? 'rtl' : 'ltr'} className="min-h-[42px] w-full rounded-lg border border-[#ddd] px-3" type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} required minLength={8} /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? text('Hide password', 'إخفاء كلمة المرور') : text('Show password', 'إظهار كلمة المرور')}>{showPassword ? text('Hide', 'إخفاء') : text('Show', 'إظهار')}</button></div></label>}
          {isSignup && <><p className="text-[13px]">{text('Use at least 8 characters.', 'استخدم 8 أحرف على الأقل.')}</p><label className="grid gap-[7px] text-[13px]">{text('Confirm password', 'تأكيد كلمة المرور')}<input dir={isArabic ? 'rtl' : 'ltr'} className="min-h-[42px] w-full rounded-lg border border-[#ddd] px-3" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={values.confirmation} onChange={(event) => setValues({ ...values, confirmation: event.target.value })} required /></label><label className="flex w-full items-center justify-start gap-2 self-start text-left text-xs leading-[1.4]"><input className="m-0 size-4 shrink-0 p-0" type="checkbox" checked={values.terms} onChange={(event) => setValues({ ...values, terms: event.target.checked })} /><span>{text('I agree to the', 'أوافق على')} <span className="underline">{text('Terms & Conditions', 'الشروط والأحكام')}</span></span></label></>}
          {error && <p className="form-error" role="alert">{error}</p>}
          {message && <p role="status">{message}</p>}
          <button className="black-button min-h-[44px]" type="submit" disabled={loading}>{loading ? text('Please wait…', 'يرجى الانتظار…') : isForgot ? text('Send reset request', 'إرسال طلب إعادة التعيين') : isSignup ? text('Create account', 'إنشاء حساب') : text('Log in', 'تسجيل الدخول')}</button>
        </form>
        {mode === 'login' && <Link className="mt-3 text-[13px] text-[#111] underline" href="/forgot-password">{text('Forgot password?', 'نسيت كلمة المرور؟')}</Link>}
        <p className="mt-[18px] text-center text-[13px]">{isSignup ? text('Already have an account?', 'لديك حساب بالفعل؟') : isForgot ? text('Remembered your password?', 'تذكرت كلمة المرور؟') : text('New to Dokan Lebss?', 'جديد في دوكان اللبس؟')} <Link className="text-[#111] underline" href={isSignup || isForgot ? '/login' : '/signup'}>{isSignup || isForgot ? text('Log in', 'تسجيل الدخول') : text('Sign up', 'إنشاء حساب')}</Link></p>
        </div>
      </section>
    </main>
  );
}

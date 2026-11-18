'use client';

import { useState, FormEvent } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Button from './Button';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

const MAILCHIMP_ACTION =
  'https://lindbergsafaris.us14.list-manage.com/subscribe/post?u=4b7c04ad3d6fe4e8c3b114ff4&id=0b2e63fece&f_id=00a12ae1f0';

const MailchimpForm = () => {
  const { t } = useTranslation(['common', 'home']);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // Honeypot check: if bot filled this invisible field, pretend success and abort
    if (honeypot) {
      e.preventDefault();
      setStatus('success');
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      e.preventDefault();
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Set submitting status
    setStatus('submitting');
    setErrorMessage(null);

    // Form will proceed with standard POST to Mailchimp in target="_blank"
    // and after a short moment we display success confirmation
    setTimeout(() => {
      setStatus('success');
    }, 800);
  };

  return (
    <div id="mc_embed_shell" className="w-full max-w-4xl mx-auto">
      <div id="mc_embed_signup">
        {status === 'success' ? (
          <div className="bg-white/10 border border-white/30 backdrop-blur-md rounded-xl p-6 text-white text-center animate-in fade-in zoom-in-95 duration-300">
            <CheckCircle2 className="mx-auto mb-3 text-secondary h-12 w-12" />
            <h3 className="text-2xl font-serif font-bold mb-2">Thank you for subscribing!</h3>
            <p className="text-gray-200 max-w-md mx-auto text-sm mb-4">
              You are now on the Lindberg Safaris priority dispatch list. Please check your inbox to confirm your subscription.
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                setEmail('');
                setPhone('');
              }}
              className="text-xs uppercase tracking-wider text-secondary underline hover:text-white transition-colors"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form
            action={MAILCHIMP_ACTION}
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            target="_blank"
            onSubmit={handleSubmit}
            className="w-full"
          >
            {status === 'error' && errorMessage && (
              <div className="mb-4 bg-red-500/20 border border-red-400 text-red-200 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={18} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div id="mc_embed_signup_scroll">
              <div className="flex flex-col md:flex-row items-end gap-4 md:gap-6">
                <div className="flex-[2] w-full text-left">
                  <label
                    htmlFor="mce-EMAIL"
                    className="text-white font-semibold mb-2 block text-sm tracking-wide"
                  >
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="EMAIL"
                    id="mce-EMAIL"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder={t('home:newsletter.placeholder', 'Enter your email address')}
                    className="w-full rounded-lg px-4 py-3 bg-white text-gray-900 border border-white/30 text-base focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="flex-[1.5] w-full text-left">
                  <label
                    htmlFor="mce-PHONE"
                    className="text-white font-semibold mb-2 block text-sm tracking-wide"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="PHONE"
                    id="mce-PHONE"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone (Optional)"
                    className="w-full rounded-lg px-4 py-3 bg-white text-gray-900 border border-white/30 text-base focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="w-full md:w-auto">
                  <Button
                    type="submit"
                    name="subscribe"
                    id="mc-embedded-subscribe"
                    variant="secondary"
                    size="lg"
                    disabled={status === 'submitting'}
                    className="w-full md:w-auto px-10 h-[50px] font-bold shadow-lg transform transition active:scale-95 disabled:opacity-75"
                  >
                    {status === 'submitting'
                      ? 'Subscribing...'
                      : t('common:buttons.subscribeNow', 'Subscribe Now')}
                  </Button>
                </div>
              </div>

              {/* Bot trap 1: React controlled honeypot */}
              <input
                type="text"
                name="user_confirm_field"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
              />

              {/* Bot trap 2: Mailchimp standard bot protection field */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
                <input
                  type="text"
                  name="b_4b7c04ad3d6fe4e8c3b114ff4_0b2e63fece"
                  tabIndex={-1}
                  defaultValue=""
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MailchimpForm;

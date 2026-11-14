'use client';

import { useState } from 'react';
import Button from './Button';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

const MailchimpForm = () => {
  const { t } = useTranslation(['common', 'home']);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div id="mc_embed_shell" className="w-full max-w-4xl mx-auto">
      <div id="mc_embed_signup">
        <form
          action="https://lindbergsafaris.us14.list-manage.com/subscribe/post?u=4b7c04ad3d6fe4e8c3b114ff4&amp;id=0b2e63fece&amp;f_id=00a12ae1f0"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          target="_blank"
          className="w-full"
        >
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  className="w-full md:w-auto px-10 h-[50px] font-bold shadow-lg transform transition active:scale-95"
                >
                  {t('common:buttons.subscribeNow', 'Subscribe Now')}
                </Button>
              </div>
            </div>

            {/* Honeypot field for anti-bot protection */}
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
      </div>
    </div>
  );
};

export default MailchimpForm;

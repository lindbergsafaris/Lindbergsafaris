'use client';

import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_3vdy70u';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_6yeyvl4';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'C-W21o3Kn1O6qbiGI';

const ContactForm = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.current) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY);
      setStatus('success');
      form.current.reset();
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again later or contact us directly via WhatsApp.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-500/10 border border-green-500/50 p-8 rounded-xl text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-serif font-bold text-white mb-2">Message Sent!</h3>
        <p className="text-gray-200 mb-6">
          Thank you for reaching out. We have received your inquiry and our safari consultants will get back to you shortly.
        </p>
        <Button
          onClick={() => setStatus('idle')}
          variant="outline"
          className="text-white border-white/20 hover:bg-white/10"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form ref={form} onSubmit={handleSubmit} className="space-y-6">
      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-center gap-3 text-red-200 mb-6">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-200 mb-1">
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="John"
          />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-200 mb-1">
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1">
            Phone / WhatsApp Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-200 mb-1">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Safari Inquiry / Booking Request"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
          placeholder="Tell us about your travel dates, preferred destinations, group size, and any special requirements..."
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === 'loading'}
        className="w-full md:w-auto"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Message...
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  );
};

export default ContactForm;

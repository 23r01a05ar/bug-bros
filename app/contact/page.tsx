'use client';

import React, { useState } from 'react';
import type { Metadata } from 'next';
import { Send, CheckCircle } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      if (error) throw error;

      setSubmitted(true);
      showToast('Message sent successfully!', 'success');
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-accent)] font-medium mb-3">
              Get in Touch
            </p>
            <h1 className="text-hero mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Contact Us
            </h1>
            <p className="text-lg text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] leading-relaxed mb-8">
              Have a question, collaboration idea, or just want to say hello?
              We&apos;d love to hear from you.
            </p>
            <div className="section-divider" />

            <div className="mt-12 space-y-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mb-2">
                  Response Time
                </h4>
                <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)]">
                  We typically respond within 24-48 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div>
            {submitted ? (
              <div className="card p-12 text-center">
                <CheckCircle size={48} className="mx-auto mb-4 text-[var(--color-success)]" />
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Message Sent!
                </h3>
                <p className="text-sm text-[var(--color-muted)] dark:text-[var(--color-dark-muted)] mb-6">
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-gold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                <Input
                  label="Name"
                  id="contact-name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  error={errors.name}
                  required
                />
                <Input
                  label="Email"
                  id="contact-email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                  required
                />
                <Textarea
                  label="Message"
                  id="contact-message"
                  placeholder="Write your message..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  error={errors.message}
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={16} />
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

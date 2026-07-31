/// Contact Form Store — local feature-scoped store as per Rule 11 & Rule 2.
/// Manages form input state, validation, and simulated submission.

import { create } from 'zustand';

export type FormStatus = 'idle' | 'sending' | 'success' | 'error';

interface ContactFormState {
  name: string;
  email: string;
  message: string;
  status: FormStatus;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setMessage: (message: string) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}

export const useContactFormStore = create<ContactFormState>((set, get) => ({
  name: '',
  email: '',
  message: '',
  status: 'idle',
  setName: (name) => set({ name, status: 'idle' }),
  setEmail: (email) => set({ email, status: 'idle' }),
  setMessage: (message) => set({ message, status: 'idle' }),
  submitForm: async () => {
    const { name, email, message } = get();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    set({ status: 'sending' });

    // Simulate async network submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    set({ status: 'success', name: '', email: '', message: '' });
  },
  resetForm: () => set({ name: '', email: '', message: '', status: 'idle' }),
}));

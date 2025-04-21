import React, { useState } from 'react';
import { Input, Button } from '@/components/atomic/atoms';

interface ContactFormProps {
  className?: string;
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm({ className = '', onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is being edited
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-md">
          Thank you for your message! I'll get back to you as soon as possible.
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-md">
          There was an error sending your message. Please try again later.
        </div>
      )}
      
      <div>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          label="Name"
          required
          placeholder="Your name"
          error={errors.name}
        />
      </div>
      
      <div>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          label="Email"
          required
          placeholder="your.email@example.com"
          error={errors.email}
          autoComplete="email"
        />
      </div>
      
      <div>
        <label 
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Message<span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder="Your message"
          required
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message}</p>
        )}
      </div>
      
      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          size="md"
          className="w-full md:w-auto"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  );
}
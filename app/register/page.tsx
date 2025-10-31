'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !photo) {
      setError('Please provide both name and photo');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('photo', photo);

      const response = await fetch('/api/participants', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      router.push('/vote');
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-block text-sm font-medium"
            style={{ color: '#0B6E4F' }}
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            Register Your Costume
          </h1>
          <p className="text-foreground/70">
            Upload a photo of your costume and enter your name
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg border border-foreground/20 focus:outline-none focus:ring-2 focus:ring-[#0B6E4F] focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="photo" className="block text-sm font-medium text-foreground">
              Costume Photo
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="w-full px-4 py-3 rounded-lg border border-foreground/20 focus:outline-none focus:ring-2 focus:ring-[#0B6E4F] focus:border-transparent"
              required
            />
          </div>

          {preview && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#0B6E4F' }}
          >
            {loading ? 'Registering...' : 'Register Costume'}
          </button>
        </form>
      </div>
    </div>
  );
}

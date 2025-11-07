'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    groupId: '',
    styleId: '',
    designerId: 'designer-1', // In real app, get from auth
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.groupId.trim()) {
      errors.groupId = 'Group ID is required';
    } else if (formData.groupId.trim().length < 3) {
      errors.groupId = 'Group ID must be at least 3 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          groupId: formData.groupId.trim(),
          styleId: formData.styleId.trim() || undefined,
        }),
      });

      if (response.ok) {
        const product = await response.json();
        router.push(`/designer/products/${product.id}`);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        setError(errorData.message || `Failed to create product (${response.status})`);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message || 'Failed to create product. Please check if the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Create New Product</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <div className="mb-4">
            <label htmlFor="groupId" className="block text-sm font-medium mb-2 text-gray-700">
              Group ID *
            </label>
            <input
              id="groupId"
              type="text"
              required
              value={formData.groupId}
              onChange={(e) => {
                setFormData({ ...formData, groupId: e.target.value });
                if (validationErrors.groupId) {
                  setValidationErrors({ ...validationErrors, groupId: '' });
                }
              }}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validationErrors.groupId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., GRP-001"
            />
            {validationErrors.groupId && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.groupId}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="styleId" className="block text-sm font-medium mb-2 text-gray-700">
              Style ID
            </label>
            <input
              id="styleId"
              type="text"
              value={formData.styleId}
              onChange={(e) => setFormData({ ...formData, styleId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., STY-001 (optional)"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


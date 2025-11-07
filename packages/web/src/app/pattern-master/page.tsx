'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function PatternMasterDashboard() {
  const [assignedTechPacks, setAssignedTechPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        // Filter products with approved tech packs
        const techPacks = Array.isArray(data) ? data : [];
        setAssignedTechPacks(techPacks);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to load tech packs. Please check if the API server is running.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Pattern Master Dashboard</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading tech packs...</p>
          </div>
        ) : assignedTechPacks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No tech packs assigned</h2>
            <p className="text-gray-500">There are no tech packs currently assigned for pattern making.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedTechPacks.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{product.groupId}</h3>
                    <p className="text-sm text-gray-600">{product.styleId || 'No Style ID'}</p>
                  </div>
                  <a
                    href={`/pattern-master/products/${product.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    View Tech Pack
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


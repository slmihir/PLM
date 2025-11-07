'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [fabrics, setFabrics] = useState<any[]>([]);
  const [trims, setTrims] = useState<any[]>([]);
  const [selectedFabric, setSelectedFabric] = useState('');
  const [selectedTrim, setSelectedTrim] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/products/${productId}`).then(async (r) => {
        if (!r.ok) throw new Error(`Failed to fetch product: ${r.statusText}`);
        return r.json();
      }),
      fetch(`${API_URL}/api/universe/fabrics`).then(async (r) => {
        if (!r.ok) return [];
        return r.json();
      }),
      fetch(`${API_URL}/api/universe/trims`).then(async (r) => {
        if (!r.ok) return [];
        return r.json();
      }),
    ]).then(([productData, fabricsData, trimsData]) => {
      setProduct(productData);
      setFabrics(Array.isArray(fabricsData) ? fabricsData : []);
      setTrims(Array.isArray(trimsData) ? trimsData : []);
      setError(null);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setError(err.message || 'Failed to load product details');
      setLoading(false);
    });
  }, [productId]);

  const linkFabric = async () => {
    if (!selectedFabric) return;
    setActionLoading('fabric');
    try {
      const response = await fetch(`${API_URL}/api/products/${productId}/fabrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fabricCode: selectedFabric,
          isPrimary: true,
        }),
      });
      if (response.ok) {
        setSelectedFabric('');
        window.location.reload();
      } else {
        alert('Failed to link fabric');
      }
    } catch (err) {
      alert('Error linking fabric');
    } finally {
      setActionLoading(null);
    }
  };

  const linkTrim = async () => {
    if (!selectedTrim) return;
    setActionLoading('trim');
    try {
      const response = await fetch(`${API_URL}/api/products/${productId}/trims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trimCode: selectedTrim,
          isPrimary: true,
        }),
      });
      if (response.ok) {
        setSelectedTrim('');
        window.location.reload();
      } else {
        alert('Failed to link trim');
      }
    } catch (err) {
      alert('Error linking trim');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <p className="font-semibold">Error</p>
          <p>{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Product: {product.groupId}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Fabrics</h2>
            <select
              value={selectedFabric}
              onChange={(e) => setSelectedFabric(e.target.value)}
              disabled={actionLoading === 'fabric'}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select Fabric</option>
              {fabrics.map((f) => (
                <option key={f.fabricCode} value={f.fabricCode}>
                  {f.fabricCode} - Qty: {f.inventoryQty || 0}
                </option>
              ))}
            </select>
            {fabrics.length === 0 && (
              <p className="text-sm text-gray-500 mb-4">No fabrics available</p>
            )}
            <button
              onClick={linkFabric}
              disabled={!selectedFabric || actionLoading === 'fabric'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {actionLoading === 'fabric' ? 'Linking...' : 'Link Fabric'}
            </button>
            <h3 className="text-sm font-semibold text-gray-700 mt-6 mb-2">Linked Fabrics</h3>
            {product.fabrics && product.fabrics.length > 0 ? (
              <ul className="space-y-2">
                {product.fabrics.map((pf: any) => (
                  <li key={pf.id} className="py-2 border-b border-gray-200 text-gray-700">
                    {pf.fabricCode} {pf.isPrimary && <span className="text-blue-600 font-medium">(Primary)</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No fabrics linked yet</p>
            )}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Trims</h2>
            <select
              value={selectedTrim}
              onChange={(e) => setSelectedTrim(e.target.value)}
              disabled={actionLoading === 'trim'}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select Trim</option>
              {trims.map((t) => (
                <option key={t.trimCode} value={t.trimCode}>
                  {t.trimCode} - Qty: {t.inventoryQty || 0}
                </option>
              ))}
            </select>
            {trims.length === 0 && (
              <p className="text-sm text-gray-500 mb-4">No trims available</p>
            )}
            <button
              onClick={linkTrim}
              disabled={!selectedTrim || actionLoading === 'trim'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {actionLoading === 'trim' ? 'Linking...' : 'Link Trim'}
            </button>
            <h3 className="text-sm font-semibold text-gray-700 mt-6 mb-2">Linked Trims</h3>
            {product.trims && product.trims.length > 0 ? (
              <ul className="space-y-2">
                {product.trims.map((pt: any) => (
                  <li key={pt.id} className="py-2 border-b border-gray-200 text-gray-700">
                    {pt.trimCode} {pt.isPrimary && <span className="text-blue-600 font-medium">(Primary)</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No trims linked yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


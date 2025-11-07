'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SourcingDashboard() {
  const [fabrics, setFabrics] = useState<any[]>([]);
  const [trims, setTrims] = useState<any[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/universe/fabrics`).then(async (r) => {
        if (!r.ok) return [];
        return r.json();
      }),
      fetch(`${API_URL}/api/universe/trims`).then(async (r) => {
        if (!r.ok) return [];
        return r.json();
      }),
      fetch(`${API_URL}/api/universe/inventory/low-stock-alerts`).then(async (r) => {
        if (!r.ok) return [];
        return r.json();
      }),
    ]).then(([fabricsData, trimsData, alertsData]) => {
      setFabrics(Array.isArray(fabricsData) ? fabricsData : []);
      setTrims(Array.isArray(trimsData) ? trimsData : []);
      setLowStockAlerts(Array.isArray(alertsData) ? alertsData : []);
      setError(null);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setError('Failed to load inventory data. Please check if the API server is running.');
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Sourcing Dashboard</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {lowStockAlerts.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <h2 className="font-semibold mb-2">Low Stock Alerts</h2>
            <ul className="space-y-1">
              {lowStockAlerts.map((alert: any, idx: number) => (
                <li key={idx} className="text-sm">
                  {alert.type} {alert.code}: {alert.currentQty} (Threshold: {alert.threshold})
                </li>
              ))}
            </ul>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading inventory data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Fabrics ({fabrics.length})</h2>
              {fabrics.length === 0 ? (
                <p className="text-gray-500 text-sm">No fabrics found</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {fabrics.slice(0, 20).map((fabric) => (
                    <div key={fabric.fabricCode} className="border-b border-gray-200 pb-2">
                      <div className="font-medium text-gray-900">{fabric.fabricCode}</div>
                      <div className="text-sm text-gray-600">
                        Qty: {fabric.inventoryQty || 0} | Threshold: {fabric.lowStockThreshold || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Trims ({trims.length})</h2>
              {trims.length === 0 ? (
                <p className="text-gray-500 text-sm">No trims found</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {trims.slice(0, 20).map((trim) => (
                    <div key={trim.trimCode} className="border-b border-gray-200 pb-2">
                      <div className="font-medium text-gray-900">{trim.trimCode}</div>
                      <div className="text-sm text-gray-600">
                        Qty: {trim.inventoryQty || 0} | Threshold: {trim.lowStockThreshold || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';

export default function ResetPanel() {
  const [result, setResult] = useState('');
  const [resetting, setResetting] = useState(false);

  const resetAllData = async () => {
    if (!confirm('⚠️ DELETE ALL TEST DATA? This will remove all transactions, customers, orders, and stock movements. Initial stock will remain.')) {
      return;
    }

    if (!confirm('Are you ABSOLUTELY sure? This cannot be undone!')) {
      return;
    }

    setResetting(true);
    setResult('Resetting...');

    try {
      const res = await fetch('/api/dev/reset-all', {
        method: 'POST'
      });

      const data = await res.json();

      if (res.ok) {
        setResult(`✅ Reset complete!\n\n${JSON.stringify(data.summary, null, 2)}`);
      } else {
        setResult(`❌ Failed: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Failed: ${error}`);
    } finally {
      setResetting(false);
    }
  };

  const generateInitialSupply = async () => {
    if (!confirm('Reset stock to initial values? This will NOT delete transactions.')) {
      return;
    }

    setResetting(true);
    setResult('Generating supply...');

    try {
      const res = await fetch('/api/dev/generate-supply', {
        method: 'POST'
      });

      const data = await res.json();

      if (res.ok) {
        setResult(`✅ Supply reset complete!\n\n${JSON.stringify(data.summary, null, 2)}`);
      } else {
        setResult(`❌ Failed: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Failed: ${error}`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-4 border-red-600 p-6 bg-red-50">
        <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Reset All Data</h2>
        <p className="mb-4 text-red-700">
          This will permanently delete:
          <ul className="list-disc list-inside">
            <li>All transactions and order history</li>
            <li>All customers and their data</li>
            <li>All stock movements</li>
            <li>All notifications</li>
          </ul>
        </p>
        <p className="mb-4 text-red-700 font-bold">
          Raw materials and products will remain, but stock levels will be affected!
        </p>
        <button
          onClick={resetAllData}
          disabled={resetting}
          className="bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-700 disabled:bg-gray-400"
        >
          Reset All Data
        </button>
      </div>

      <div className="border-4 border-green-600 p-6 bg-green-50">
        <h2 className="text-2xl font-bold text-green-600 mb-4">🔄 Reset Supply</h2>
        <p className="mb-4 text-green-700">
          This will:
          <ul className="list-disc list-inside">
            <li>Reset all raw material stock to initial values</li>
            <li>Create stock movement records for the adjustments</li>
            <li>NOT affect any other data (orders, customers, etc)</li>
          </ul>
        </p>
        <p className="mb-4 text-green-700 font-bold">
          Use this to replenish stock without affecting transaction history
        </p>
        <button
          onClick={generateInitialSupply}
          disabled={resetting}
          className="bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400"
        >
          Reset Supply
        </button>
      </div>

      {result && (
        <pre className="font-mono text-sm p-4 bg-gray-100 rounded whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';

type Scenario = 'slow_monday' | 'busy_friday' | 'weekend_rush' | 'one_week' | 'q1_2025';

export default function BundleGenerator() {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [progress, setProgress] = useState('');

  const scenarios = {
    slow_monday: {
      name: 'Slow Monday Morning',
      description: '20 transactions, 15 customers, 7-11am',
      transactions: 20,
      customers: 15
    },
    busy_friday: {
      name: 'Busy Friday Afternoon',
      description: '80 transactions, 50 customers, 12-5pm',
      transactions: 80,
      customers: 50
    },
    weekend_rush: {
      name: 'Weekend Rush',
      description: '150 transactions, 100 customers, 8am-8pm',
      transactions: 150,
      customers: 100
    },
    one_week: {
      name: 'One Week Operation',
      description: '400 transactions, 200 customers, Mon-Sun',
      transactions: 400,
      customers: 200
    },
    q1_2025: {
      name: 'Q1 2025 Full Quarter',
      description: '3000+ transactions, 500+ customers, Jan-Mar',
      transactions: 3000,
      customers: 500
    }
  };

  const generateBundle = async (scenario: Scenario) => {
    const scenarioData = scenarios[scenario];
    if (!confirm(`Generate ${scenarioData.name}?\n\nThis will create:\n- ${scenarioData.customers} customers\n- ${scenarioData.transactions} transactions\n\nThis may take a few minutes for large datasets.`)) {
      return;
    }

    setGenerating(true);
    setProgress('Checking store setup...');
    setResult('');

    try {
      // First ensure store exists
      const storeRes = await fetch('/api/dev/ensure-store', {
        method: 'POST'
      });

      if (!storeRes.ok) {
        throw new Error('Store setup failed - please run seed script first');
      }

      setProgress(`Generating ${scenarioData.transactions} transactions...`);
      console.log(`[BundleGen] Starting ${scenario}...`);

      const res = await fetch('/api/dev/generate-bundle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      });

      console.log(`[BundleGen] Response status: ${res.status}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log('[BundleGen] Success:', data);

      setProgress('');
      setResult(`✅ Generated successfully!

Scenario: ${data.summary.scenario}
Date Range: ${data.summary.dateRange}

Results:
- Customers Created: ${data.summary.customers}
- Transactions Created: ${data.summary.transactionsCreated}
- Transactions Failed: ${data.summary.transactionsFailed}

${data.summary.transactionsFailed > 0 ? '⚠️ Some transactions failed due to insufficient stock.' : ''}`);

    } catch (error: any) {
      console.error('[BundleGen] Error:', error);
      setProgress('');
      setResult(`❌ Generation Failed

Error: ${error.message}

Common causes:
1. Insufficient raw material stock (click "Generate Initial Supply" in Reset tab)
2. Database connection issue
3. Store not configured properly

Check browser console (F12) for detailed error logs.`);
    } finally {
      setGenerating(false);
    }
  };

  const exportSQL = async () => {
    setProgress('Exporting...');
    try {
      const res = await fetch('/api/dev/export-sql');
      
      if (!res.ok) {
        throw new Error(`Export failed: HTTP ${res.status}`);
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qios-test-data-${Date.now()}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setProgress('');
      setResult('✅ SQL export downloaded successfully');
    } catch (error: any) {
      console.error('[Export] Error:', error);
      setProgress('');
      setResult(`❌ Export failed: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      {progress && (
        <div className="bg-blue-100 border-2 border-blue-600 p-4 font-bold">
          ⏳ {progress}
        </div>
      )}

      <div className="border-2 border-gray-300 p-4">
        <h3 className="font-bold text-lg mb-4">PRESET SCENARIOS</h3>
        <div className="space-y-3">
          {Object.entries(scenarios).map(([key, scenario]) => (
            <div key={key} className="border-2 border-gray-300 p-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-lg">{scenario.name}</div>
                <div className="text-sm text-gray-600">{scenario.description}</div>
              </div>
              <button
                onClick={() => generateBundle(key as Scenario)}
                disabled={generating}
                className="bg-blue-600 text-white px-6 py-3 font-bold border-2 border-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {generating ? 'GENERATING...' : 'GENERATE'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-2 border-gray-300 p-4">
        <h3 className="font-bold text-lg mb-4">EXPORT DATA</h3>
        <button
          onClick={exportSQL}
          disabled={generating}
          className="bg-green-600 text-white px-6 py-3 font-bold border-2 border-green-800 disabled:bg-gray-400"
        >
          📥 DOWNLOAD SQL EXPORT
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Export current database state as SQL file (includes all transactions, customers, stock movements, and notifications)
        </p>
      </div>

      {result && (
        <div className="border-2 border-gray-300 p-4 bg-gray-50">
          <h3 className="font-bold mb-2">RESULT</h3>
          <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
        </div>
      )}
    </div>
  );
}
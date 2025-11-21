'use client';

import { useState } from 'react';
import TransactionInput from './TransactionInput';
import BundleGenerator from './BundleGenerator';
import ResetPanel from './ResetPanel';

type Tab = 'transaction' | 'bundle' | 'reset';

export default function DevTestingTool() {
  const [activeTab, setActiveTab] = useState<Tab>('transaction');

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-red-600 text-white p-4 mb-6 border-4 border-red-800">
        <h1 className="text-2xl font-bold">⚠️ QIOS Developer Testing Tool</h1>
        <p>Only available in development mode. Use for testing only!</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
        <button
          onClick={() => setActiveTab('transaction')}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === 'transaction'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100'
          }`}
        >
          Transaction Input
        </button>

        <button
          onClick={() => setActiveTab('bundle')}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === 'bundle'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100'
          }`}
        >
          Bundle Generator
        </button>

        <button
          onClick={() => setActiveTab('reset')}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === 'reset'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100'
          }`}
        >
          Reset Panel
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white border-4 border-gray-300 p-6">
        {activeTab === 'transaction' && <TransactionInput />}
        {activeTab === 'bundle' && <BundleGenerator />}
        {activeTab === 'reset' && <ResetPanel />}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, CreditCard } from 'lucide-react';

export default function Settings() {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`${
                  activeTab === id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center px-6 py-4 border-b-2 text-sm font-medium`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">{userData?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {userData?.displayName || 'Not set'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Change Password
              </button>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Current Plan
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  You are currently on the{' '}
                  <span className="font-medium">
                    {userData?.subscription?.tier === 'pro' ? 'Pro' : 'Free'}
                  </span>{' '}
                  plan.
                </p>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                {userData?.subscription?.tier === 'pro'
                  ? 'Manage Subscription'
                  : 'Upgrade to Pro'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
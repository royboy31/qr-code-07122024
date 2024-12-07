import React from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const pricingTiers = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for personal use',
    features: [
      'Unlimited QR codes',
      'All QR code types',
      'Basic customization',
      'Standard quality',
      'Basic scan tracking'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    description: 'For professionals and small businesses',
    highlighted: true,
    features: [
      'Everything in Free',
      'Advanced analytics',
      'Custom dynamic URLs',
      'High-quality QR codes',
      'Priority support',
      'Download analytics data',
      'API access',
      'Remove branding'
    ]
  }
];

export default function PricingSection() {
  const { userData } = useAuth();

  const handleSubscribe = async (tier: typeof pricingTiers[0]) => {
    // For demo purposes, redirect to contact page for pro subscriptions
    if (tier.id === 'pro') {
      window.location.href = 'mailto:contact@example.com?subject=Pro%20Subscription%20Request';
    }
  };

  return (
    <div className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Select the perfect plan for your QR code needs
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                tier.highlighted
                  ? 'border-2 border-indigo-500 scale-105 z-10'
                  : 'border border-gray-200'
              }`}
            >
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {tier.name}
                </h3>
                <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${tier.price}
                  </span>
                  <span className="text-base font-medium text-gray-500">/month</span>
                </p>
                <button
                  onClick={() => handleSubscribe(tier)}
                  className={`mt-8 block w-full py-3 px-6 border rounded-md text-center font-medium ${
                    tier.highlighted
                      ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700'
                      : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {userData?.subscription?.tier === tier.id
                    ? 'Current Plan'
                    : tier.price === 0
                    ? 'Get Started'
                    : 'Contact Us'}
                </button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">
                  What's included
                </h4>
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <Check
                        className={`flex-shrink-0 h-5 w-5 ${
                          tier.highlighted ? 'text-indigo-500' : 'text-green-500'
                        }`}
                      />
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
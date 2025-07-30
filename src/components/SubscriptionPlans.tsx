import React, { useState } from 'react';
import { X, Check, Star, Zap, Crown, CreditCard, Shield, Sparkles } from 'lucide-react';

interface SubscriptionPlansProps {
  currentPlan: string;
  onPlanChange: (plan: string) => void;
  onClose: () => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  currentPlan,
  onPlanChange,
  onClose
}) => {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: <Star className="w-6 h-6" />,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        '10 conversations per day',
        'Basic AI responses',
        'Standard voice synthesis',
        'Email support',
        '1 language support',
        'Basic themes'
      ],
      limitations: [
        'Limited conversation history',
        'No priority support',
        'Basic features only'
      ],
      color: 'from-gray-500 to-gray-600',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: <Zap className="w-6 h-6" />,
      price: { monthly: 19, yearly: 190 },
      description: 'Best for professionals and power users',
      features: [
        'Unlimited conversations',
        'Advanced AI responses',
        'Premium voice synthesis',
        'Priority support',
        '12+ language support',
        'Custom themes',
        'Conversation analytics',
        'Export conversations',
        'Advanced search',
        'Voice input/output'
      ],
      limitations: [],
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: <Crown className="w-6 h-6" />,
      price: { monthly: 49, yearly: 490 },
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Admin dashboard',
        'Custom integrations',
        'API access',
        'White-label options',
        'Dedicated support',
        'Custom AI training',
        'Advanced security',
        'SLA guarantee',
        'Custom deployment',
        'Unlimited team members'
      ],
      limitations: [],
      color: 'from-purple-500 to-purple-600',
      popular: false
    }
  ];

  const handleUpgrade = async (planId: string) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onPlanChange(planId);
    setIsProcessing(false);
    
    // Show success message
    alert(`Successfully upgraded to ${plans.find(p => p.id === planId)?.name} plan!`);
    onClose();
  };

  const getYearlySavings = (plan: any) => {
    const monthlyCost = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly;
    return monthlyCost - yearlyCost;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Choose Your Plan
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Unlock the full potential of Narobot AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                    : selectedPlan === plan.id
                    ? 'border-blue-400'
                    : 'border-gray-200 dark:border-gray-700'
                } ${
                  currentPlan === plan.id ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                {currentPlan === plan.id && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Current
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${plan.price[billingCycle]}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Save ${getYearlySavings(plan)} per year
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={currentPlan === plan.id || isProcessing}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                      currentPlan === plan.id
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : currentPlan === plan.id ? (
                      'Current Plan'
                    ) : plan.id === 'free' ? (
                      'Downgrade to Free'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </button>

                  {plan.id !== 'free' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                      Cancel anytime • No hidden fees
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Feature Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Feature
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-white">
                      Free
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-white">
                      Pro
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-white">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Daily Conversations</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">10</td>
                    <td className="px-4 py-3 text-center text-sm text-green-600 dark:text-green-400">Unlimited</td>
                    <td className="px-4 py-3 text-center text-sm text-green-600 dark:text-green-400">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Languages</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">1</td>
                    <td className="px-4 py-3 text-center text-sm text-green-600 dark:text-green-400">12+</td>
                    <td className="px-4 py-3 text-center text-sm text-green-600 dark:text-green-400">12+</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Voice Synthesis</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">Basic</td>
                    <td className="px-4 py-3 text-center text-sm text-green-600 dark:text-green-400">Premium</td>
                    <td className="px-4 py-3 text-center text-sm text-green-600 dark:text-green-400">Premium</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">API Access</td>
                    <td className="px-4 py-3 text-center text-sm text-red-500">✗</td>
                    <td className="px-4 py-3 text-center text-sm text-red-500">✗</td>
                    <td className="px-4 py-3 text-center text-sm text-green-600 dark:text-green-400">✓</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Team Collaboration</td>
                    <td className="px-4 py-3 text-center text-sm text-red-500">✗</td>
                    <td className="px-4 py-3 text-center text-sm text-red-500">✗</td>
                    <td className="px-4 py-3 text-center text-sm text-green-600 dark:text-green-400">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Security & Trust */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>30-day money back</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
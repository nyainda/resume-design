
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Zap, Star } from 'lucide-react';
import { toast } from 'sonner';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
}

const TestPayments: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [purchasedPlans, setPurchasedPlans] = useState<string[]>([]);

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      description: 'Perfect for getting started',
      features: [
        '5 Resume Templates',
        '3 Cover Letter Templates', 
        'PDF Download',
        'Basic Support'
      ],
      color: 'from-gray-400 to-gray-600'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 19.99,
      description: 'Most popular choice',
      features: [
        '20+ Resume Templates',
        '8 Cover Letter Templates',
        'ATS Optimization',
        'Multiple Formats',
        'Priority Support',
        'Custom Branding'
      ],
      popular: true,
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 39.99,
      description: 'For serious professionals',
      features: [
        'All Templates (Unlimited)',
        'AI-Powered Content',
        'Personal Branding Kit',
        'Interview Preparation',
        '1-on-1 Career Coaching',
        'LinkedIn Optimization',
        '24/7 Premium Support'
      ],
      color: 'from-purple-500 to-purple-700'
    }
  ];

  const handlePurchase = async (planId: string, planName: string, price: number) => {
    setLoading(planId);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For testing, we'll just mark it as purchased
      setPurchasedPlans(prev => [...prev, planId]);
      toast.success(`Successfully purchased ${planName} plan!`);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const isPurchased = (planId: string) => purchasedPlans.includes(planId);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Your Plan
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Unlock premium features and templates to boost your career
        </p>
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            🚀 <strong>Testing Mode:</strong> All payments are simulated for demonstration purposes
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
              plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
            } ${isPurchased(plan.id) ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0">
                <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
                  <Star className="w-4 h-4 inline mr-1" />
                  Most Popular
                </div>
              </div>
            )}

            {isPurchased(plan.id) && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-500 text-white">
                  <Check className="w-3 h-3 mr-1" />
                  Purchased
                </Badge>
              </div>
            )}

            <div className={`h-24 bg-gradient-to-r ${plan.color} ${plan.popular ? 'mt-6' : ''}`}>
              <div className="flex items-center justify-center h-full">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">${plan.price}</div>
                  <div className="text-sm opacity-90">per month</div>
                </div>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  isPurchased(plan.id)
                    ? 'bg-green-600 hover:bg-green-700'
                    : plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                } text-white`}
                disabled={loading === plan.id || isPurchased(plan.id)}
                onClick={() => handlePurchase(plan.id, plan.name, plan.price)}
              >
                {isPurchased(plan.id) ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Purchased
                  </>
                ) : loading === plan.id ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Choose Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {purchasedPlans.length > 0 && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Premium Features Unlocked!
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-300">
              You now have access to all premium templates and features.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default TestPayments;

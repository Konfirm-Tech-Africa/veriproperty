
// import React, { useState } from 'react';
// import { useFlutterwave, closePaymentModal, FlutterwaveResponse } from 'flutterwave-react-v3';
// // Assuming the path to your SubscriptionContext is correct
// import { useSubscription } from '../../../../../context/SubscriptionContext'; 
// import { Check, AlertCircle } from 'lucide-react';

// // --- Types for Flutterwave and Backend Integration ---

// interface FlutterwaveConfig {
//   public_key: string;
//   tx_ref: string;
//   amount: number;
//   currency: string;
//   payment_options: string;
//   customer: {
//     email: string;
//     name: string;
//     phone_number?: string;
//   };
//   customizations: {
//     title: string;
//     description: string;
//     logo: string;
//   };
//   meta?: Record<string, unknown>;
// }

// // Added the generic type from flutterwave-react-v3 for clarity and correctness
// type PaymentResponse = FlutterwaveResponse;

// interface SubscriptionPlan {
//   _id: string;
//   name: string;
//   displayName: string;
//   description: string;
//   pricing: {
//     monthly: number;
//     yearly: number;
//     formatted: {
//       monthly: string;
//       yearly: string;
//     };
//   };
//   currency: string;
//   limits: {
//     listings: number;
//     manualPushUps: number;
//     featuredListings: number;
//     clientRequests: number;
//   };
//   features: Record<string, boolean>;
//   isFree?: boolean;
// }

// interface UserSubscription {
//   planName: string;
//   status: string;
//   // Add other subscription properties as needed
// }

// // Assumed type for the Usage Data object
// interface UsageData {
//   listingsCreated: number;
//   limit: number;
//   manualPushUps: number;
//   manualPushUpsLimit: number;
//   featuredListingsUsed: number;
//   featuredListingsLimit: number;
//   clientRequestsUsed: number;
//   clientRequestsLimit: number;
// }

// // Assumed type for the context hook's return value (Crucial for type safety)
// interface SubscriptionContextValue {
//   plans: SubscriptionPlan[];
//   currentSubscription: UserSubscription | null;
//   usageData: UsageData | null;
//   loading: boolean;
//   error: string | null;
//   billingCycle: { type: 'monthly' | 'yearly'; label: string };
//   currency: { code: 'USD' | 'NGN'; symbol: string; name: string };
//   setBillingCycle: React.Dispatch<React.SetStateAction<{ type: 'monthly' | 'yearly'; label: string }>>;
//   setCurrency: React.Dispatch<React.SetStateAction<{ code: 'USD' | 'NGN'; symbol: string; name: string }>>;
//   subscribeToPlan: (planName: string, cycle: 'monthly' | 'yearly', currency: 'USD' | 'NGN') => Promise<{ payment_url?: string } | null>;
//   cancelSubscription: () => Promise<void>;
//   upgradeSubscription: (newPlanName: string) => Promise<void>;
//   refreshSubscriptions: () => Promise<void>;
//   clearError: () => void;
// }

// // --- Main Component ---

// export default function PaymentSettings() {
//   // Type cast the hook result based on the assumed interface
//   const {
//     plans,
//     currentSubscription,
//     usageData,
//     loading,
//     error,
//     billingCycle,
//     currency,
//     setBillingCycle,
//     setCurrency,
//     subscribeToPlan,
//     cancelSubscription,
//     upgradeSubscription,
//     refreshSubscriptions,
//     clearError
//   } = useSubscription() as SubscriptionContextValue; 

//   const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [localError, setLocalError] = useState<string | null>(null);

//   // Initialize Flutterwave configuration
//   const getFlutterwaveConfig = (paymentData: {
//     tx_ref: string;
//     amount: number;
//     currency: string;
//     customer?: {
//       email: string;
//       name: string;
//       phone?: string;
//     };
//     customizations?: {
//       title: string;
//       description: string;
//       logo?: string;
//     };
//     meta?: Record<string, unknown>;
//   }): FlutterwaveConfig => ({
//     public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || 'FLWPUBK_TEST-XXXXXXXXXXXXXXXXX',
//     tx_ref: paymentData.tx_ref,
//     amount: paymentData.amount,
//     currency: paymentData.currency,
//     payment_options: 'card,ussd,mobilemoney,banktransfer',
//     customer: {
//       email: paymentData.customer?.email || 'customer@example.com',
//       name: paymentData.customer?.name || 'Customer',
//       phone_number: paymentData.customer?.phone || ''
//     },
//     customizations: {
//       title: paymentData.customizations?.title || 'PropertyGuru Subscription',
//       description: paymentData.customizations?.description || 'Subscription Payment',
//       logo: paymentData.customizations?.logo || 'https://your-logo-url.com/logo.png'
//     },
//     meta: paymentData.meta
//   });

//   // Handle subscription payment
//   const handleSubscribe = async (plan: SubscriptionPlan) => {
//     try {
//       setIsProcessing(true);
//       clearError();
//       setLocalError(null);
//       setSelectedPlan(plan._id);

//       // Cast billingCycle.type and currency.code for the subscribeToPlan function
//       const cycleType = billingCycle.type;
//       const currencyCode = currency.code;

//       // Call your backend to create subscription
//       const response = await subscribeToPlan(
//         plan.name, 
//         cycleType, 
//         currencyCode
//       );

//       // If we get a payment URL, redirect to Flutterwave
//       if (response?.payment_url) {
//         // Use window.location.assign for explicit redirection intent
//         window.location.assign(response.payment_url);
//       } else {
//         setLocalError('No payment URL received from server. Please check backend logs.');
//       }

//     } catch (err) {
//       console.error('Subscription error:', err);
//       // Ensure error handling captures unknown error types safely
//       let errorMessage: string;
//       if (err instanceof Error) {
//           errorMessage = err.message;
//       } else if (typeof err === 'object' && err !== null && 'message' in err) {
//           errorMessage = (err as { message: string }).message;
//       } else {
//           errorMessage = 'Failed to process subscription due to an unknown error.';
//       }
//       setLocalError(errorMessage);
//     } finally {
//       setIsProcessing(false);
//       setSelectedPlan(null);
//     }
//   };

//   // Direct Flutterwave payment (alternative approach)
//   const DirectFlutterwavePayment = React.useCallback(({ plan }: { plan: SubscriptionPlan }) => {
//     const price = plan.pricing[billingCycle.type];
//     const tx_ref = `PG_${Date.now()}_${plan.name}_${billingCycle.type}`;
    
//     // Note: The customer email and name should ideally be fetched from a User context/session
//     const config = getFlutterwaveConfig({
//       tx_ref,
//       amount: price,
//       currency: currency.code,
//       customer: {
//         email: 'user@example.com',
//         name: 'User Name'
//       },
//       customizations: {
//         title: `PropertyGuru ${plan.displayName}`,
//         description: `${plan.displayName} - ${billingCycle.type}ly billing`
//       },
//       meta: {
//         plan_name: plan.name,
//         interval: billingCycle.type,
//         user_id: 'user_id_here'
//       }
//     });

//     // useFlutterwave should be called only once and memoized, but here it's called inside a component, which is fine if that component is intended to be used as a wrapper.
//     const handleFlutterwavePayment = useFlutterwave(config);

//     const handlePayment = () => {
//       // Set processing state when payment is initiated
//       setIsProcessing(true);
//       handleFlutterwavePayment({
//         callback: async (response: PaymentResponse) => {
//           console.log('Payment response:', response);
          
//           if (response.status === 'successful') {
//             try {
//               // Verify payment with your backend using Fetch API
//               const verificationResponse = await fetch('/api/subscriptions/flutterwave/callback', {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   transaction_id: response.transaction_id,
//                   tx_ref: response.tx_ref,
//                   status: response.status
//                 })
//               });

//               if (verificationResponse.ok) {
//                 setPaymentSuccess(true);
//                 await refreshSubscriptions();
//                 alert('Payment successful! Your subscription has been activated.');
//               } else {
//                 // Read and display error message from the verification response if possible
//                 const errorData = await verificationResponse.json();
//                 throw new Error(errorData.message || 'Payment verification failed');
//               }
//             } catch (error) {
//               console.error('Payment verification error:', error);
//               // Handle potential error during JSON parsing or network issue
//               const errorMessage = error instanceof Error ? error.message : 'An error occurred during verification.';
//               setLocalError(errorMessage);
//               alert(`Payment verification failed. Error: ${errorMessage}`);
//             }
//           } else if (response.status === 'cancelled') {
//             alert('Payment was cancelled.');
//           } else {
//             alert('Payment failed. Please try again.');
//           }
          
//           closePaymentModal();
//           setIsProcessing(false);
//         },
//         onClose: () => {
//           console.log('Payment modal closed');
//           setIsProcessing(false);
//         },
//       });
//     };

//     return (
//       <button
//         onClick={handlePayment}
//         disabled={isProcessing} // Disable button while processing
//         className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {isProcessing ? 'Processing Payment...' : 'Pay with Flutterwave'}
//       </button>
//     );
//   }, [billingCycle, currency, isProcessing]); // Added dependencies to React.useCallback

//   // Handle subscription cancellation
//   const handleCancelSubscription = async () => {
//     // Moved the clearError and setLocalError to the start of the try block
//     // to ensure a clean slate before the operation starts.
//     clearError();
//     setLocalError(null);
//     if (confirm('Are you sure you want to cancel your subscription?')) {
//       try {
//         setIsProcessing(true);
        
//         await cancelSubscription();
//         alert('Subscription cancelled successfully.');
//         await refreshSubscriptions();
//       } catch (err) {
//         console.error('Cancellation error:', err);
//         const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
//         setLocalError(errorMessage);
//       } finally {
//         setIsProcessing(false);
//       }
//     }
//   };

//   // Handle subscription upgrade
//   const handleUpgrade = async (newPlanName: string) => {
//     clearError();
//     setLocalError(null);
//     try {
//       setIsProcessing(true);
//       await upgradeSubscription(newPlanName);
//       // Optional: Add success alert or refresh
//       alert(`Subscription upgrade to ${newPlanName} initiated/successful.`);
//       await refreshSubscriptions();
//     } catch (err) {
//       console.error('Upgrade error:', err);
//       const errorMessage = err instanceof Error ? err.message : 'Failed to upgrade subscription';
//       setLocalError(errorMessage);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Format currency display
//   const formatCurrency = (amount: number): string => {
//     // Assuming the amount from the backend is in Kobo/Cent (smallest unit)
//     const mainAmount = amount / 100;
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: currency.code,
//       minimumFractionDigits: 2, // Ensure consistent currency formatting
//     }).format(mainAmount);
//   };

//   // Get the actual price for display
//   const getDisplayPrice = (plan: SubscriptionPlan): number => {
//     return plan.pricing[billingCycle.type] || 0;
//   };

//   // Clear all errors
//   const clearAllErrors = () => {
//     clearError();
//     setLocalError(null);
//   };

//   const displayError = error || localError;

//   if (loading && !plans.length) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }
  
//   // Note: Added an optional check for usageData and currentSubscription in the final JSX to avoid runtime errors if they are null (as per the interface definition).

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="text-center mb-12">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">
//           Subscription Plans
//         </h1>
//         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//           Choose the plan that works best for your real estate business
//         </p>
//       </div>

//       {/* Currency and Billing Cycle Selector */}
//       <div className="flex justify-center mb-8">
//         <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col sm:flex-row gap-4 items-center">
//           <div className="flex items-center gap-2">
//             <label className="text-sm font-medium text-gray-700">Currency:</label>
//             <select
//               value={currency.code}
//               onChange={(e) => setCurrency({
//                 code: e.target.value as 'USD' | 'NGN',
//                 symbol: e.target.value === 'USD' ? '$' : '₦',
//                 name: e.target.value === 'USD' ? 'US Dollar' : 'Nigerian Naira'
//               })}
//               className="border border-gray-300 rounded-md px-3 py-1 text-sm"
//             >
//               <option value="USD">USD ($)</option>
//               <option value="NGN">NGN (₦)</option>
//             </select>
//           </div>

//           <div className="flex items-center gap-2">
//             <label className="text-sm font-medium text-gray-700">Billing:</label>
//             <div className="flex bg-gray-100 rounded-md p-1">
//               <button
//                 onClick={() => setBillingCycle({ type: 'monthly', label: 'Monthly' })}
//                 className={`px-3 py-1 text-sm rounded-md transition-colors ${
//                   billingCycle.type === 'monthly'
//                     ? 'bg-blue-600 text-white'
//                     : 'text-gray-600 hover:text-gray-900'
//                 }`}
//               >
//                 Monthly
//               </button>
//               <button
//                 onClick={() => setBillingCycle({ type: 'yearly', label: 'Yearly' })}
//                 className={`px-3 py-1 text-sm rounded-md transition-colors ${
//                   billingCycle.type === 'yearly'
//                     ? 'bg-blue-600 text-white'
//                     : 'text-gray-600 hover:text-gray-900'
//                 }`}
//               >
//                 Yearly
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Error Display */}
//       {displayError && (
//         <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
//           <AlertCircle className="w-5 h-5 text-red-500" />
//           <p className="text-red-700 text-sm">{displayError}</p>
//           <button
//             onClick={clearAllErrors}
//             className="ml-auto text-red-500 hover:text-red-700"
//           >
//             ×
//           </button>
//         </div>
//       )}

//       {/* Success Message */}
//       {paymentSuccess && (
//         <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
//           <Check className="w-5 h-5 text-green-500" />
//           <p className="text-green-700 text-sm">
//             Payment successful! Your subscription has been activated.
//           </p>
//           <button
//             onClick={() => setPaymentSuccess(false)}
//             className="ml-auto text-green-500 hover:text-green-700"
//           >
//             ×
//           </button>
//         </div>
//       )}

//       {/* Plans Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//         {plans.map((plan) => {
//           const isCurrentPlan = currentSubscription?.planName === plan.name;
//           const price = getDisplayPrice(plan);
//           const isFreePlan = plan.name === 'starter' && price === 0;

//           return (
//             <div
//               key={plan._id}
//               className={`bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
//                 isCurrentPlan
//                   ? 'border-blue-500 ring-2 ring-blue-100'
//                   : 'border-gray-200'
//               }`}
//             >
//               {/* Plan Header */}
//               <div className="p-6 border-b border-gray-100">
//                 <div className="flex justify-between items-start mb-2">
//                   <div>
//                     <h3 className="text-xl font-semibold text-gray-900">
//                       {plan.displayName}
//                     </h3>
//                     <p className="text-gray-600 text-sm mt-1">
//                       {plan.description}
//                     </p>
//                   </div>
//                   {isCurrentPlan && (
//                     <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                       Current
//                     </span>
//                   )}
//                 </div>

//                 {/* Price */}
//                 <div className="mt-4">
//                   <div className="flex items-baseline gap-1">
//                     <span className="text-3xl font-bold text-gray-900">
//                       {isFreePlan ? 'Free' : formatCurrency(plan.pricing[billingCycle.type])}
//                     </span>
//                     {!isFreePlan && (
//                       <span className="text-gray-500 text-sm">
//                         /{billingCycle.type === 'monthly' ? 'month' : 'year'}
//                       </span>
//                     )}
//                   </div>
//                   {billingCycle.type === 'yearly' && !isFreePlan && (
//                     <p className="text-green-600 text-sm mt-1">
//                       Save with yearly billing
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Features */}
//               <div className="p-6">
//                 <h4 className="font-medium text-gray-900 mb-3">Features</h4>
//                 <ul className="space-y-2">
//                   {Object.entries(plan.features).map(([key, value]) => (
//                     value && (
//                       <li key={key} className="flex items-center gap-2 text-sm">
//                         <Check className="w-4 h-4 text-green-500" />
//                         <span className="text-gray-600 capitalize">
//                           {/* Better formatting for feature keys */}
//                           {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
//                         </span>
//                       </li>
//                     )
//                   ))}
//                 </ul>

//                 {/* Limits */}
//                 <h4 className="font-medium text-gray-900 mt-4 mb-3">Limits</h4>
//                 <ul className="space-y-2 text-sm text-gray-600">
//                   <li>Listings: {plan.limits.listings}</li>
//                   <li>Manual Push-ups: {plan.limits.manualPushUps}</li>
//                   <li>Featured Listings: {plan.limits.featuredListings}</li>
//                   <li>Client Requests: {plan.limits.clientRequests}</li>
//                 </ul>
//               </div>

//               {/* Action Button */}
//               <div className="p-6 pt-0">
//                 {isCurrentPlan ? (
//                   <div className="space-y-3">
//                     <button
//                       onClick={handleCancelSubscription}
//                       disabled={isProcessing}
//                       className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {isProcessing ? 'Cancelling...' : 'Cancel Subscription'}
//                     </button>
//                   </div>
//                 ) : (
//                   // You can choose to use the backend-redirect method (handleSubscribe) or the client-side method (DirectFlutterwavePayment)
//                   // For a clean subscription flow, the backend-redirect is usually safer.
//                   <button
//                     onClick={() => handleSubscribe(plan)}
//                     disabled={isProcessing || (isFreePlan && currentSubscription)}
//                     className={`w-full py-2 px-4 rounded-lg transition-colors ${
//                       isFreePlan
//                         ? currentSubscription
//                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                           : 'bg-green-600 text-white hover:bg-green-700'
//                         : 'bg-blue-600 text-white hover:bg-blue-700'
//                     } disabled:opacity-50 disabled:cursor-not-allowed`}
//                   >
//                     {isProcessing && selectedPlan === plan._id ? 'Processing...' : 
//                       isFreePlan ? 
//                         (currentSubscription ? 'Already Active' : 'Activate Free Plan') : 
//                         (currentSubscription ? 'Upgrade Plan' : 'Subscribe Now')}
//                   </button>
                  
//                   // Alternative: Use the direct Flutterwave component if preferred
//                   /* <DirectFlutterwavePayment plan={plan} /> */
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Current Usage */}
//       {usageData && currentSubscription && (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">
//             Current Usage
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <div className="text-center">
//               <div className="text-2xl font-bold text-blue-600">
//                 {usageData.listingsCreated}
//               </div>
//               <div className="text-sm text-gray-600">Listings Created</div>
//               <div className="text-xs text-gray-500">
//                 Limit: {usageData.limit === -1 ? 'Unlimited' : usageData.limit}
//               </div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-green-600">
//                 {usageData.manualPushUps}
//               </div>
//               <div className="text-sm text-gray-600">Manual Push-ups</div>
//               <div className="text-xs text-gray-500">
//                 Limit: {usageData.manualPushUpsLimit === -1 ? 'Unlimited' : usageData.manualPushUpsLimit}
//               </div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-purple-600">
//                 {usageData.featuredListingsUsed}
//               </div>
//               <div className="text-sm text-gray-600">Featured Listings</div>
//               <div className="text-xs text-gray-500">
//                 Limit: {usageData.featuredListingsLimit === -1 ? 'Unlimited' : usageData.featuredListingsLimit}
//               </div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-orange-600">
//                 {usageData.clientRequestsUsed}
//               </div>
//               <div className="text-sm text-gray-600">Client Requests</div>
//               <div className="text-xs text-gray-500">
//                 Limit: {usageData.clientRequestsLimit === -1 ? 'Unlimited' : usageData.clientRequestsLimit}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// ```
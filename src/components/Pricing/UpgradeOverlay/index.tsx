"use client";

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface UpgradeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeOverlay: React.FC<UpgradeOverlayProps> = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');

  if (!isOpen) return null;

  const plans = [
    {
      name: 'Free Mate',
      price: '$0',
      description: 'Personal nodes.',
      features: [
        '100 Neural Tokens / mo',
        'Standard Protocol Library',
        'Private BYOI Data Plane',
        'Local Engine Simulation',
        'Community Pulse Support'
      ],
      cta: 'Current Plan',
      isCurrent: true
    },
    {
      name: 'Pro Mate',
      price: billingCycle === 'yearly' ? '$16' : '$19',
      description: 'Production logic.',
      features: [
        '400 Neural Tokens / mo',
        'Advanced Trace Diagnostics',
        'Priority Engine Scheduling',
        'Custom Protocol Adapters',
        'Cross-Node Telemetry',
        'Neural Region Selection'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Elite Architect',
      price: billingCycle === 'yearly' ? '$67' : '$79',
      description: 'Enterprise clusters.',
      features: [
        '2000 Neural Tokens / mo',
        'Zero-Latency Node Clusters',
        'Unlimited Custom Adapters',
        '24/7 Dedicated Support',
        'Advanced RLS Policy Guard',
        'Multi-Region Balancing'
      ],
      cta: 'Get Elite'
    }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(12px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '"Outfit", sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '850px',
        position: 'relative',
        animation: 'fadeInUp 0.2s ease-out'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: 0,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid #111',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* Toggle Billing */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            padding: '3px',
            borderRadius: '100px',
            border: '1px solid #111',
            display: 'flex',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                background: billingCycle === 'yearly' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Yearly <span style={{ fontSize: '8px', background: 'rgba(255, 255, 255, 0.05)', color: '#666', padding: '1px 5px', borderRadius: '4px', fontWeight: 900 }}>Save 33%</span>
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                background: billingCycle === 'monthly' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: '#444',
                fontSize: '11px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.popular ? '#070707' : '#050505',
                border: `1px solid ${plan.popular ? '#222' : '#111'}`,
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: plan.popular ? '0 20px 40px rgba(0,0,0,0.4)' : 'none'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '8px',
                  fontWeight: 900,
                  padding: '3px 8px',
                  borderRadius: '100px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Popular
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{plan.name}</h3>
                <p style={{ fontSize: '11px', color: '#444', lineHeight: 1.4 }}>{plan.description}</p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 900, color: '#fff' }}>{plan.price}</span>
                </div>
                <div style={{ fontSize: '9px', color: '#333', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px', letterSpacing: '0.05em' }}>
                  per month billed {billingCycle}
                </div>
              </div>

              <button style={{
                width: '100%',
                height: '42px',
                borderRadius: '10px',
                background: plan.isCurrent ? 'transparent' : (plan.popular ? '#fff' : 'rgba(255,255,255,0.03)'),
                color: plan.popular ? '#000' : (plan.isCurrent ? '#333' : '#fff'),
                fontSize: '13px',
                fontWeight: 900,
                border: plan.isCurrent ? '1px solid #111' : 'none',
                cursor: plan.isCurrent ? 'default' : 'pointer',
                marginBottom: '20px',
                transition: 'all 0.2s'
              }}>
                {plan.cta}
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plan.features.map((feature) => (
                  <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ minWidth: '14px' }}>
                      <Check size={12} color={plan.isCurrent ? '#111' : '#666'} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#555', fontWeight: 600 }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ color: '#222', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Powered by Tryliate Foundry Neural Core
          </p>
        </div>
      </div>
    </div>
  );
};

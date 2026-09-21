import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CARE-A Portal | Executive E-Commerce Admin',
  description: 'Enterprise D2C control center for inventory, order fulfillment, customer profiles, and telemetry analytics.'
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      {children}
    </div>
  );
}

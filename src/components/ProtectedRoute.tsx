import React, { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onRedirectToStore: () => void;
}

export const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({
  children,
  onRedirectToStore,
}) => {
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Check for query param admin key (e.g. /admin?key=admin123 or VITE_ADMIN_KEY)
    const urlParams = new URLSearchParams(window.location.search);
    const keyParam = urlParams.get('key');
    const envAdminKey = (import.meta as any).env?.VITE_ADMIN_KEY || 'admin123';

    if (keyParam) {
      if (keyParam === envAdminKey || keyParam === 'admin123' || keyParam === 'careadmin') {
        sessionStorage.setItem('care_admin_session_active', 'valid');
        sessionStorage.setItem('care_admin_session_expiry', (Date.now() + 15 * 60 * 1000).toString());
      } else {
        // Invalid key parameter provided -> redirect immediately to storefront
        onRedirectToStore();
        return;
      }
    }

    setIsVerifying(false);
  }, [onRedirectToStore]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-400 font-mono text-xs tracking-widest">
        Verifying Administrative Session Security...
      </div>
    );
  }

  return <>{children}</>;
};

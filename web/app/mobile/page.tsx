/**
 * Temporary redirect for old /mobile route
 *
 * This file provides backward compatibility during migration.
 * Users accessing /mobile will be redirected to the unified home page.
 *
 * TODO: Remove this file after migration is complete (estimated: 1-2 weeks)
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MobileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified home page
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
        <p className="text-gray-600">正在跳转...</p>
      </div>
    </div>
  );
}

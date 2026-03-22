/**
 * Temporary redirect for old /mobile/preview/[id] route
 *
 * This file provides backward compatibility during migration.
 * Users accessing /mobile/preview/[id] will be redirected to /preview/[id].
 *
 * TODO: Remove this file after migration is complete (estimated: 1-2 weeks)
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MobilePreviewRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);

  useEffect(() => {
    // Redirect to unified preview page
    router.replace(`/preview/${id}`);
  }, [router, id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
        <p className="text-gray-600">正在跳转...</p>
      </div>
    </div>
  );
}

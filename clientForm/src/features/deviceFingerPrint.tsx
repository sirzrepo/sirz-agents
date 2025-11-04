'use client';
import { useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function DeviceFingerprint({ onFingerprint }: { onFingerprint: (id: string) => void }) {
  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      onFingerprint(result.visitorId);
    };
    loadFingerprint();
  }, [onFingerprint]);

  return null; // hidden, background component
}

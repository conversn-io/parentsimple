'use client';

import { useEffect } from 'react';
import { useFooter, useHeader } from '../contexts/FooterContext';

export const useFunnelLayout = () => {
  const { setHeaderType } = useHeader();

  useEffect(() => {
    // Only set header to funnel, keep footer as standard
    setHeaderType('funnel');
    return () => {
      setHeaderType('standard');
    };
  }, [setHeaderType]);
};

// Keep the old hook for backward compatibility
export const useFunnelFooter = () => {
  const { setFooterType } = useFooter();

  useEffect(() => {
    setFooterType('funnel');
    return () => setFooterType('standard');
  }, [setFooterType]);
};

'use client';

import { useEffect } from 'react';
import { useFooter, useHeader } from '../contexts/FooterContext';

export const useFunnelLayout = () => {
  const { setFooterType } = useFooter();
  const { setHeaderType } = useHeader();

  useEffect(() => {
    setFooterType('funnel');
    setHeaderType('funnel');
    return () => {
      setFooterType('standard');
      setHeaderType('standard');
    };
  }, [setFooterType, setHeaderType]);
};

// Keep the old hook for backward compatibility
export const useFunnelFooter = () => {
  const { setFooterType } = useFooter();

  useEffect(() => {
    setFooterType('funnel');
    return () => setFooterType('standard');
  }, [setFooterType]);
};

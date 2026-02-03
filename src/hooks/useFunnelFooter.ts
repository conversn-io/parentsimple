'use client';

import { useEffect } from 'react';
import { useFooter, useHeader } from '../contexts/FooterContext';

export const useFunnelLayout = () => {
  const { setHeaderType } = useHeader();
  const { setFooterType } = useFooter();

  useEffect(() => {
    // Set both header and footer to funnel for quiz pages
    setHeaderType('funnel');
    setFooterType('funnel');
    return () => {
      setHeaderType('standard');
      setFooterType('standard');
    };
  }, [setHeaderType, setFooterType]);
};

// Layout with no header (for variant B and other minimal designs)
export const useNoHeaderLayout = () => {
  const { setHeaderType } = useHeader();
  const { setFooterType } = useFooter();

  useEffect(() => {
    // Remove header, keep funnel footer
    setHeaderType('none');
    setFooterType('funnel');
    return () => {
      setHeaderType('standard');
      setFooterType('standard');
    };
  }, [setHeaderType, setFooterType]);
};

// Keep the old hook for backward compatibility
export const useFunnelFooter = () => {
  const { setFooterType } = useFooter();

  useEffect(() => {
    setFooterType('funnel');
    return () => setFooterType('standard');
  }, [setFooterType]);
};

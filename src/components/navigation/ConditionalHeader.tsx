'use client';

import { Header } from './Header';
import { FunnelHeader } from './FunnelHeader';
import { useHeader } from '../../contexts/FooterContext';

const ConditionalHeader = () => {
  const { headerType } = useHeader();
  
  // Support 'none' headerType for headerless pages (like variant B)
  if (headerType === 'none') return null;
  
  return headerType === 'funnel' ? <FunnelHeader /> : <Header />;
};

export default ConditionalHeader;







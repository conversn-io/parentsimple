'use client';

import { Header } from './Header';
import { FunnelHeader } from './FunnelHeader';
import { useHeader } from '../../contexts/FooterContext';

const ConditionalHeader = () => {
  const { headerType } = useHeader();
  
  return headerType === 'funnel' ? <FunnelHeader /> : <Header />;
};

export default ConditionalHeader;







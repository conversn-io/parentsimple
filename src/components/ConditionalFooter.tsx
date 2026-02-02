'use client';

import Footer from './Footer';
import FunnelFooter from './FunnelFooter';
import { useFooter } from '../contexts/FooterContext';

const ConditionalFooter = () => {
  const { footerType } = useFooter();
  
  return footerType === 'funnel' ? <FunnelFooter /> : <Footer />;
};

export default ConditionalFooter;







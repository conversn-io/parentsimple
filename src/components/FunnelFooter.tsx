import Link from 'next/link';

const FunnelFooter = () => {
  return (
    <footer className="py-6 px-6 bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-600">
          <Link 
            href="/privacy-policy" 
            className="hover:text-gray-900 transition-colors"
            prefetch={false}
          >
            Privacy Policy
          </Link>
          <span className="text-gray-300">|</span>
          <Link 
            href="/terms-of-service" 
            className="hover:text-gray-900 transition-colors"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <span className="text-gray-300">|</span>
          <Link 
            href="/disclaimers" 
            className="hover:text-gray-900 transition-colors"
            prefetch={false}
          >
            Disclaimers
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default FunnelFooter;







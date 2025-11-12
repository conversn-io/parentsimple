'use client';

export default function OTPDebugPage() {
  const testOTP = async () => {
    const phoneNumber = '+18587524266';
    
    // Test the exact same logic as useOTP.ts
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_QUIZ_URL || 'https://jqjftrlnyysqcwbbigpw.supabase.co';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_QUIZ_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxamZ0cmxueXlzcWN3YmJpZ3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTQ2MzksImV4cCI6MjA2Njg3MDYzOX0.ZqgLIflQJY5zC3ZnU5K9k_KEM9bDdNhtq3ek6ckuwjAo';
    
    console.log('🔍 Client Environment Debug:', {
      envUrl: process.env.NEXT_PUBLIC_SUPABASE_QUIZ_URL ? 'SET' : 'NOT SET',
      envKey: process.env.NEXT_PUBLIC_SUPABASE_QUIZ_ANON_KEY ? 'SET' : 'NOT SET',
      fallbackUrl: supabaseUrl,
      fallbackKeyPrefix: anonKey.substring(0, 20) + '...'
    });
    
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`
        },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();
      console.log('📱 OTP Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      if (response.ok) {
        alert('✅ OTP Send Success! Check your phone.');
      } else {
        alert(`❌ OTP Send Failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ OTP Error:', error);
      alert(`❌ OTP Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">OTP Debug Test</h1>
      <p className="text-gray-600 mb-6">
        This page tests the OTP functionality with the exact same code as the quiz.
      </p>
      <button
        onClick={testOTP}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Test OTP Send
      </button>
      <p className="text-sm text-gray-500 mt-4">
        Check the browser console for detailed logs.
      </p>
    </div>
  </div>
  );
}

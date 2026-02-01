# OTP System Documentation

A comprehensive, reusable OTP (One-Time Password) verification system for React applications.

## 🚀 Quick Start

### Simple Usage
```tsx
import { OTPVerification } from '@/components/otp';

function MyComponent() {
  const handleVerificationComplete = (phoneNumber: string) => {
    console.log('Phone verified:', phoneNumber);
  };

  return (
    <OTPVerification
      phoneNumber="+18587524266"
      onVerificationComplete={handleVerificationComplete}
    />
  );
}
```

### Advanced Usage with Hook
```tsx
import { useOTP } from '@/hooks/useOTP';

function MyComponent() {
  const {
    state,
    phoneNumber,
    otp,
    setPhoneNumber,
    setOTP,
    sendOTP,
    verifyOTP,
    resendOTP
  } = useOTP({
    phoneNumber: '+18587524266',
    onVerificationComplete: (phone) => console.log('Verified:', phone),
    onVerificationFailed: (error) => console.error('Failed:', error)
  });

  return (
    <div>
      {/* Your custom UI */}
    </div>
  );
}
```

## 📦 Components

### OTPVerification
The main component that handles the complete OTP flow.

**Props:**
- `phoneNumber: string` - Initial phone number
- `onVerificationComplete: (phone: string) => void` - Called when OTP is verified
- `onVerificationFailed?: (error: string) => void` - Called when verification fails
- `onResendOTP?: (phone: string) => Promise<boolean>` - Custom resend logic
- `showPhoneInput?: boolean` - Show phone input step (default: false)
- `autoSendOTP?: boolean` - Auto-send OTP when phone is valid (default: false)
- `maxAttempts?: number` - Maximum verification attempts (default: 3)
- `resendCooldown?: number` - Resend cooldown in seconds (default: 60)
- `debugMode?: boolean` - Enable debug logging (default: false)

### PhoneInput
Standalone phone number input component.

**Props:**
- `value: string` - Phone number value
- `onChange: (phone: string) => void` - Change handler
- `onBlur?: () => void` - Blur handler
- `placeholder?: string` - Input placeholder
- `disabled?: boolean` - Disabled state
- `error?: string` - Error message
- `className?: string` - Additional CSS classes

### OTPInput
Standalone OTP code input component.

**Props:**
- `value: string` - OTP value
- `onChange: (otp: string) => void` - Change handler
- `onComplete?: (otp: string) => void` - Called when OTP is complete
- `disabled?: boolean` - Disabled state
- `error?: string` - Error message
- `className?: string` - Additional CSS classes
- `maxLength?: number` - Maximum OTP length (default: 6)

## 🎣 Hooks

### useOTP
The core hook that manages OTP state and logic.

**Configuration:**
```tsx
const config: OTPHookConfig = {
  phoneNumber: '+18587524266',
  maxAttempts: 3,
  resendCooldown: 60,
  onVerificationComplete: (phone) => console.log('Verified:', phone),
  onVerificationFailed: (error) => console.error('Failed:', error),
  onResendOTP: async (phone) => { /* custom resend logic */ },
  autoResend: false,
  debugMode: false
};
```

**Return Value:**
```tsx
const {
  // State
  state: OTPState,
  phoneNumber: string,
  otp: string,
  
  // Actions
  setPhoneNumber: (phone: string) => void,
  setOTP: (otp: string) => void,
  sendOTP: () => Promise<boolean>,
  verifyOTP: () => Promise<boolean>,
  resendOTP: () => Promise<boolean>,
  clearError: () => void,
  reset: () => void,
  
  // Computed
  isValidPhone: boolean,
  isValidOTP: boolean,
  canVerify: boolean,
  canResend: boolean
} = useOTP(config);
```

## 🛠️ Utilities

### Phone Utilities
```tsx
import { formatUSPhoneNumber, isValidUSPhoneNumber, formatPhoneForDisplay } from '@/utils/phone-utils';

// Format phone number with country code
const formatted = formatUSPhoneNumber('8587524266'); // '+18587524266'

// Validate phone number
const isValid = isValidUSPhoneNumber('+18587524266'); // true

// Format for display
const display = formatPhoneForDisplay('+18587524266'); // '+1 (858) 752-4266'
```

### OTP Utilities
```tsx
import { validateOTP, formatOTPDisplay, generateOTP } from '@/utils/otp-utils';

// Validate OTP format
const isValid = validateOTP('123456'); // true

// Format OTP for display
const display = formatOTPDisplay('123456'); // '123 456'

// Generate random OTP
const otp = generateOTP(); // '123456'
```

## 🎨 Styling

The components use Tailwind CSS classes and can be customized with the `className` prop:

```tsx
<OTPVerification
  phoneNumber="+18587524266"
  onVerificationComplete={handleComplete}
  className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
/>
```

## 🔧 Configuration

### Environment Variables
The OTP system uses these environment variables:

```env
NEXT_PUBLIC_SUPABASE_QUIZ_URL=https://jqjftrlnyysqcwbbigpw.supabase.co
NEXT_PUBLIC_SUPABASE_QUIZ_ANON_KEY=your_anon_key
```

### Supabase Edge Functions
The system requires these Supabase Edge Functions:
- `send-otp` - Sends OTP via Twilio
- `verify-otp` - Verifies OTP code

## 📱 Integration Examples

### Quiz Integration
```tsx
import { OTPVerification } from '@/components/otp';

function QuizStep({ onComplete }) {
  return (
    <OTPVerification
      phoneNumber=""
      onVerificationComplete={onComplete}
      showPhoneInput={true}
      autoSendOTP={true}
    />
  );
}
```

### Form Integration
```tsx
import { useOTP } from '@/hooks/useOTP';

function ContactForm() {
  const { state, phoneNumber, setPhoneNumber, sendOTP, verifyOTP } = useOTP({
    phoneNumber: '',
    onVerificationComplete: (phone) => {
      // Update form with verified phone
      setFormData(prev => ({ ...prev, phone }));
    }
  });

  return (
    <form>
      <input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone number"
      />
      <button onClick={sendOTP} disabled={!state.canResend}>
        Send OTP
      </button>
      {/* OTP input and verify button */}
    </form>
  );
}
```

## 🧪 Testing

### Unit Tests
```tsx
import { render, fireEvent, waitFor } from '@testing-library/react';
import { OTPVerification } from '@/components/otp';

test('sends OTP when phone is valid', async () => {
  const mockOnComplete = jest.fn();
  
  render(
    <OTPVerification
      phoneNumber="+18587524266"
      onVerificationComplete={mockOnComplete}
    />
  );
  
  // Test phone input and OTP flow
});
```

### Integration Tests
```tsx
import { useOTP } from '@/hooks/useOTP';

test('useOTP hook manages state correctly', () => {
  const { result } = renderHook(() => useOTP({
    phoneNumber: '+18587524266',
    onVerificationComplete: jest.fn()
  }));
  
  expect(result.current.isValidPhone).toBe(true);
});
```

## 🚀 Deployment

### Prerequisites
1. Supabase project with Edge Functions
2. Twilio account with Verify Service
3. Environment variables configured

### Setup Steps
1. Deploy Supabase Edge Functions
2. Configure Twilio secrets in Supabase
3. Set environment variables
4. Import components in your app

## 📚 API Reference

### Types
```tsx
interface OTPConfig {
  phoneNumber: string;
  maxAttempts?: number;
  resendCooldown?: number;
  showPhoneNumber?: boolean;
  className?: string;
}

interface OTPState {
  isVerifying: boolean;
  isResending: boolean;
  attempts: number;
  error: string | null;
  canResend: boolean;
  resendTimer: number;
}
```

### Error Handling
The system handles these error scenarios:
- Invalid phone number format
- Network errors
- Twilio API errors
- Expired OTP codes
- Too many attempts
- Invalid OTP codes

## 🔄 Version History

### v1.0.0
- Initial release
- Basic OTP verification
- Phone number formatting
- Resend functionality
- Error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.





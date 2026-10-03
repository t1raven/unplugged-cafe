'use client';

import CartProvider from './CartProvider';
import DeviceProvider  from './DeviceProvider';
import ThemeProvider from './ThemeProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DeviceProvider>
      <ThemeProvider>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </DeviceProvider>
  );
}
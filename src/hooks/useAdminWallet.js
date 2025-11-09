import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';

export function useAdminWallet() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      checkIfAdmin();
    } else {
      setIsAdmin(false);
    }
  }, [isConnected, address]);

  const checkIfAdmin = async () => {
    try {
      setIsLoading(true);
      
      // Step 1: Get a nonce from backend
      const nonceResponse = await fetch(
        `http://localhost:3001/api/auth/nonce?address=${address}`
      );
      const { nonce } = await nonceResponse.json();

      // Step 2: Sign the nonce with wallet
      const message = `Sign this message to authenticate:\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;
      const signature = await signMessageAsync({ message });

      // Step 3: Send signature to backend
      const authResponse = await fetch('http://localhost:3001/api/auth/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: address,
          signature,
          message,
        }),
      });

      const authData = await authResponse.json();

      if (authData.success) {
        // Save the token
        localStorage.setItem('adminToken', authData.token);
        
        // Check if user is admin
        if (authData.user.is_admin) {
          setIsAdmin(true);
          // Redirect to dashboard
          window.location.href = '/admin/dashboard';
        } else {
          alert('This wallet is not authorized as admin');
          disconnect();
        }
      }
    } catch (error) {
      console.error('Admin check failed:', error);
      alert('Failed to verify admin status');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    address,
    isConnected,
    isAdmin,
    isLoading,
    disconnect,
  };
}
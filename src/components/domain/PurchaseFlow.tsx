'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { DomainSearchResult } from '@/types/domain'
import { formatPrice } from '@/lib/utils'
import { useDomains } from '@/hooks/useDomains'

interface PurchaseFlowProps {
  domain: DomainSearchResult
  onClose: () => void
  onSuccess: () => void
}

export default function PurchaseFlow({ domain, onClose, onSuccess }: PurchaseFlowProps) {
  const [step, setStep] = useState<'confirm' | 'signing' | 'pending' | 'success' | 'error'>('confirm')
  const [error, setError] = useState<string>('')
  const [txHash] = useState<string>('')
  
  const { trackMint } = useDomains()
  
  // Contract interaction
  const { writeContract, isPending: isWriting } = useWriteContract()
  
  // Wait for transaction
  const { isSuccess } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  })

  const handlePurchase = async () => {
    try {
      setStep('signing')
      
      // This would interact with your deployed DomainCore contract
      // You'll need to add the actual contract ABI and address
      await writeContract({
        address: process.env.NEXT_PUBLIC_DOMAIN_CORE_ADDRESS as `0x${string}`,
        abi: [
          {
            name: 'mintDomain',
            type: 'function',
            inputs: [
              { name: 'name', type: 'string' },
              { name: 'extension', type: 'string' }
            ],
            outputs: [],
            stateMutability: 'payable'
          }
        ],
        functionName: 'mintDomain',
        args: [domain.name, domain.extension],
        value: parseEther(domain.price || '0'),
      })
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed'
      setError(errorMessage)
      setStep('error')
    }
  }

  // Handle successful transaction
  if (isSuccess && step !== 'success') {
    setStep('success')
    trackMint({
      txHash,
      domainName: domain.name,
      extension: domain.extension,
      price: domain.price
    }).then(() => {
      onSuccess()
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Purchase Domain</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Domain Info */}
          <div className="text-center">
            <h3 className="text-2xl font-bold">{domain.fullName}</h3>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {formatPrice(domain.price || '0')} ETH
            </div>
            <Badge variant="success" className="mt-2">Available</Badge>
          </div>

          {/* Steps */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Transaction Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Domain:</span>
                    <span>{domain.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span>{formatPrice(domain.price || '0')} ETH</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{formatPrice(domain.price || '0')} ETH</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handlePurchase} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isWriting}
              >
                {isWriting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Confirming Transaction...
                  </>
                ) : (
                  'Purchase Domain'
                )}
              </Button>
            </div>
          )}

          {step === 'signing' && (
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <div>
                <h4 className="font-semibold">Sign Transaction</h4>
                <p className="text-sm text-gray-600">Please sign the transaction in your wallet</p>
              </div>
            </div>
          )}

          {step === 'pending' && (
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <div>
                <h4 className="font-semibold">Transaction Pending</h4>
                <p className="text-sm text-gray-600">Waiting for blockchain confirmation...</p>
                {txHash && (
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs hover:underline"
                  >
                    View on Etherscan
                  </a>
                )}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <div>
                <h4 className="font-semibold text-green-600">Purchase Successful!</h4>
                <p className="text-sm text-gray-600">
                  You now own {domain.fullName}
                </p>
              </div>
              <Button onClick={onSuccess} className="w-full">
                Continue
              </Button>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
              <div>
                <h4 className="font-semibold text-red-600">Transaction Failed</h4>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('confirm')} className="flex-1">
                  Try Again
                </Button>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

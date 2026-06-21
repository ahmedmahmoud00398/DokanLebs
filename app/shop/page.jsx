import { Suspense } from 'react'
import ShopContent from '@/components/ShopContent'
import { Spinner } from '@/components/UI'

// useSearchParams() requires a Suspense boundary so Next.js can statically
// prerender the rest of the page shell while search params resolve on the client.
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center pt-[200px] pb-20">
        <Spinner size={40} />
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}

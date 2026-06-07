'use client'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const DressUpModal = dynamic(() => import('../DressUpModal'), { ssr: false })

export default function DressUpPage() {
  const router = useRouter()
  return <DressUpModal onClose={() => router.push('/wish-room')} />
}

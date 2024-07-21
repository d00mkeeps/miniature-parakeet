'use client'

import dynamic from "next/dynamic"

const AuthButton = dynamic(() => import('../atoms/AuthButton'), {
    ssr: false, 
    loading: () => <div>Loading...</div>
})

export default function ClientAuthButton() {
    return <AuthButton/>
}
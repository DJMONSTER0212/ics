import React from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

const Callback = () => {
    const router = useRouter(); // Next router
    const { data: session, status } = useSession();
    if (status == 'loading') {
        return ('loading')
    }
    if (!session) {
        router.push('/auth/signin')
    }
    switch (session.user.role) {
        case 'tnit':
            router.push('/panel/tnit/settings')
            break;
        case 'admin':
            router.push('/panel/admin/dashboard')
            break;
        case 'vendor':
            router.push('/panel/vendor/dashboard')
            break;
        default:
            router.push('/')
            break;
    }
}

export default Callback
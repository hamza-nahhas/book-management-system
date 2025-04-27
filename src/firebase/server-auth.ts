import { adminAuth } from '@/firebase/admin'
import { DecodedIdToken } from 'firebase-admin/auth'
import { NextRequest } from 'next/server'

export async function verifyAuth(
  req: NextRequest
): Promise<{ user: DecodedIdToken } | { error: string; status: number }> {
  const authorization = req.headers.get('Authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return { error: 'Unauthorized: Missing or invalid Authorization header', status: 401 }
  }

  const idToken = authorization.split('Bearer ')[1]
  if (!idToken) {
    return { error: 'Unauthorized: Token not provided', status: 401 }
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    return { user: decodedToken }
  } catch (error: any) {
    console.error('Error verifying Firebase ID token:', error)

    let message = 'Unauthorized: Invalid token'
    if (error.code === 'auth/id-token-expired') {
      message = 'Unauthorized: Token expired'
    }
    return { error: message, status: 401 }
  }
}

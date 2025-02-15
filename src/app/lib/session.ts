import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

// Define the SessionPayload type
export interface SessionPayload extends JWTPayload {
  userId: string;
  expires: number;  // Expires should be a number representing the expiration time in seconds
}

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expires)  // Set expiration using the timestamp in seconds
    .sign(encodedKey);  // Sign with the secret key
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;  // Cast payload to SessionPayload type
  } catch (error) {
    console.log('Failed to verify session');
    return null;  // Return null if verification fails
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);  // 7 days from now
  const expiresInSeconds = Math.floor(expiresAt.getTime() / 1000);  // Convert to seconds

  const session = await encrypt({ userId, expires: expiresInSeconds }); // if we dont await we get get-error
    
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

// New function to update session expiration time
export async function updateSession() {
  const session = (await cookies()).get('session')?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;  // If no session exists, return null
  }

  // Set new expiration time for the session (7 days from now)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);  // 7 days from now
  const expiresInSeconds = Math.floor(expiresAt.getTime() / 1000);  // Convert to seconds

  // Create new session with updated expiration time
  const newSession = await encrypt({
    userId: payload.userId,
    expires: expiresInSeconds,
  });

  const cookieStore = await cookies(); 
  cookieStore.set('session', newSession, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
  return { ok: true };  // Return success
}

export async function verifySession() {
    try {
      // Retrieve the session cookie
      const cookieStore = await cookies();
      const session = cookieStore.get('session')?.value;
  
      if (!session) {
        console.log('No session cookie found.');
        return null; // No session cookie exists
      }
  
      // Attempt to decrypt the session
      const payload = await decrypt(session);
  
      if (!payload) {
        console.log('Failed to decrypt session or session is invalid.');
        return null; // Session is invalid
      }
  
      // Check if the session has expired
      const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
      if (payload.expires < currentTimestamp) {
        console.log('Session has expired.');
        return null; // Session is expired
      }
  
      console.log('Session is valid:', payload);
      return payload; // Return the valid session payload
    } catch (error) {
      console.error('Error verifying session:', error);
      return null; // Return null if any error occurs
    }
  }

export async function deleteSession() {
    const cookieStore = await cookies()
    
    // Log before deleting the session cookie
    console.log("Deleting session cookie...");
    
    cookieStore.delete('session');
    cookieStore.delete('jwt');
    // Log after deleting the session cookie
    console.log("Session cookie & token deleted successfully.");
}

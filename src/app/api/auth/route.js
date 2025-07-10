import { authenticateAdmin } from '../../../lib/auth';

export async function POST(req) {
  const { email, password } = await req.json(); 
  const token = await authenticateAdmin(email, password);

  if (!token) {
    return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true, token }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800; ${
        process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      }`,
      
    },
  });
}

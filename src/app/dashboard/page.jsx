import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { verifyToken } from '../../lib/auth';
import Dashboard from './Dashboard';

async function fetchListings(token, page = 1) {
  const res = await fetch(`http://localhost:3000/api/listings?page=${page}`, {
  headers: { Authorization: `Bearer ${token}` },
  cache: 'no-store',
});

  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
}

async function fetchAuditLogs(token) {
  const res = await fetch(`http://localhost:3000/api/listings/audit`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export default async function DashboardPage({ searchParams }) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get('token')?.value;

  if (!token || !verifyToken(token)) {
    console.error('Invalid or missing token');
    redirect('/login');
  }

  try {
    const listingsData = await fetchListings(token, 1);
    const auditLogs = await fetchAuditLogs(token);
    return (
      <Dashboard
        listings={listingsData.listings}
        total={listingsData.total}
        auditLogs={auditLogs}
      />
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    redirect('/login');
  }
}

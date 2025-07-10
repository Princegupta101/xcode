
import { NextResponse } from 'next/server';

import { verifyToken } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/db';
import { AuditLog } from '../../../../lib/models';

export async function GET(req) {
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers));
  console.log('Request URL:', req.url);

  try {
    await connectDB();
    console.log('Database connected successfully');

    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);
    if (!token || !decoded?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const logs = await AuditLog.find()
      .populate('listingId')
      .sort({ timestamp: -1 });
    console.log('Audit logs fetched:', logs.length);

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
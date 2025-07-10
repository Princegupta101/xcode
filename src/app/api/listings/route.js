import { NextResponse } from 'next/server';

import { verifyToken } from '../../../lib/auth';
import {connectDB} from '../../../lib/db';
import { Listing } from '../../../lib/models';

export async function GET(req) {
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers));
  console.log('Request URL:', req.url); 

  try {
    await connectDB();
    console.log('Database connected successfully');

    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';
    const status = searchParams.get('status');
    const pageSize = 10;
    const skip = (parseInt(page) - 1) * pageSize;

    const query = status ? { status } : {};
    const listings = await Listing.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });
    const total = await Listing.countDocuments(query);
    console.log('Listings fetched:', listings.length, 'Total:', total);

    return NextResponse.json({ listings, total });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
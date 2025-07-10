import { NextResponse } from 'next/server';

import { verifyToken } from '../../../../lib/auth';
import { connectDB } from '../../../../lib/db';
import { Listing, AuditLog } from '../../../../lib/models';

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const token = req.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);

    if (!token || !decoded?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; 

    const body = await req.json();
    const { title, description, price, status } = body;

    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return NextResponse.json({ message: 'Invalid price value: must be a valid number >= 0' }, { status: 400 });
      }
      body.price = parsedPrice;
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (body.price !== undefined) updateFields.price = body.price;
    if (status !== undefined) updateFields.status = status;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ message: 'No valid fields provided to update' }, { status: 400 });
    }

    const listing = await Listing.findByIdAndUpdate(id, updateFields, { new: true });

    if (!listing) {
      return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
    }

    await AuditLog.create({
      listingId: id,
      adminId: decoded.id,
      action: status ? `Changed status to ${status}` : 'Updated listing',
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

'use client';
import { useRouter } from 'next/navigation';
import { useState, useContext, useCallback } from 'react';

import AuditLog from '../../components/AuditLog.jsx';
import EditListingForm from '../../components/EditListingForm.jsx';
import { FeedbackContext } from '../../components/Feedback.jsx';
import Layout from '../../components/Layout.jsx';
import ListingTable from '../../components/ListingTable.jsx';

export default function Dashboard({ listings: initialListings, total, auditLogs }) {
  const [listings, setListings] = useState(initialListings);
  const [editingListing, setEditingListing] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const { setFeedback } = useContext(FeedbackContext);
  const router = useRouter();

  const handleAction = useCallback(
    async (id, action) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const res = await fetch(`/api/listings/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: action }),
        });
        if (res.ok) {
          setListings((prev) =>
            prev.map((l) => (l._id === id ? { ...l, status: action } : l))
          );
          setFeedback(`Listing ${action} successfully`);
        } else {
          const error = await res.json();
          setFeedback(error.message || 'Failed to update listing');
        }
      } catch {
        setFeedback('An error occurred');
      }
    },
    [setFeedback, router]
  );

  const handleSave = useCallback(
    async (listing) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const res = await fetch(`/api/listings/${listing._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(listing),
        });
        if (res.ok) {
          const updatedListing = await res.json();
          setListings((prev) =>
            prev.map((l) => (l._id === listing._id ? updatedListing : l))
          );
          setEditingListing(null);
          setFeedback('Listing updated successfully');
        } else {
          const error = await res.json();
          setFeedback(error.message || 'Failed to update listing');
        }
      } catch {
        setFeedback('An error occurred');
      }
    },
    [setFeedback, router]
  );

  const handleFilter = useCallback(
    async (status) => {
      try {
        setStatusFilter(status);
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const res = await fetch(
          `/api/listings?page=1${status ? `&status=${status}` : ''}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const { listings: newListings } = await res.json();
          setListings(newListings);
        } else {
          const error = await res.json();
          setFeedback(error.message || 'Failed to fetch listings');
        }
      } catch {
        setFeedback('An error occurred');
      }
    },
    [setFeedback, router]
  );

  return (
    <Layout>
      <div className="mb-4">
        <select
          onChange={(e) => handleFilter(e.target.value || null)}
          className="border rounded p-2"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {editingListing ? (
        <EditListingForm
          listing={editingListing}
          onSave={handleSave}
          onCancel={() => setEditingListing(null)}
        />
      ) : (
        <ListingTable listings={listings} onAction={handleAction} onEdit={setEditingListing} />
      )}
      <AuditLog logs={auditLogs} />
    </Layout>
  );
}

import React from 'react';

function ListingTable({ listings, onAction, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Description</th>
            <th className="p-3">Price</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing._id} className="border-t">
              <td className="p-3">{listing.title}</td>
              <td className="p-3">{listing.description}</td>
              <td className="p-3">${listing.price}</td>
              <td className="p-3">{listing.status}</td>
              <td className="p-3">
                <button
                  onClick={() => onAction(listing._id, 'approved')}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Approved
                </button>
                <button
                  onClick={() => onAction(listing._id, 'rejected')}
                  className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                >
                  Rejected
                </button>
                <button
                  onClick={() => onEdit(listing)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ListingTable;

export default function AuditLog({ logs }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Audit Log</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="p-3">Timestamp</th>
            <th className="p-3">Admin</th>
            <th className="p-3">Action</th>
            <th className="p-3">Listing</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id} className="border-t">
              <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="p-3">{log.adminId}</td>
              <td className="p-3">{log.action}</td>
              <td className="p-3">{log.listing?.title || 'Unknown'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

import { FeedbackContext } from './Feedback.jsx';

export default function Layout({ children }) {
  const { feedback } = useContext(FeedbackContext);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4">
        <div className="max-w-7xl mx-auto flex justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button onClick={() => router.push('/login')} className="text-blue-600">
            Logout
          </button>
        </div>
      </nav>
      {feedback && (
        <div className="max-w-7xl mx-auto mt-4 p-4 bg-green-100 text-green-700 rounded">
          {feedback}
        </div>
      )}
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
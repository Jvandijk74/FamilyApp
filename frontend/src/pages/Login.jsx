import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Login = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const { selectUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.data.users);
    } catch (err) {
      setError('Kon gebruikers niet laden');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (userId) => {
    setError('');
    setSelecting(true);

    const result = await selectUser(userId);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setSelecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👨‍👩‍👧‍👦 FamilyApp
          </h1>
          <p className="text-gray-600">Wie ben jij?</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              disabled={selecting}
              className="w-full bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-900 py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              {user.name}
            </button>
          ))}
        </div>

        {users.length === 0 && !error && (
          <div className="text-center text-gray-600">
            Geen gebruikers gevonden
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

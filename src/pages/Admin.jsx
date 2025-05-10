import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4 p-6 bg-black border border-gray-800 shadow rounded-xl text-white">
      <h2 className="text-2xl font-bold text-[#F4A300]">Painel Admin</h2>
      <p className="text-gray-300">
        Bem-vindo, <strong className="text-white">{user.email}</strong>
      </p>
      <button
        onClick={logout}
        className="bg-[#F4A300] text-black px-4 py-2 rounded hover:bg-yellow-500 transition"
      >
        Sair
      </button>
    </div>
  );
}

export default Admin;

import { useState } from 'react';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate('/admin'); // Admin vai para painel
    } catch (e) {
      setErro('Credenciais inválidas');
    }
  };

  const entrarComoVisitante = async () => {
    try {
      await signInAnonymously(auth);
      navigate('/'); // Visitante volta para página inicial
    } catch (error) {
      console.error("Erro ao entrar como visitante:", error);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-6 p-6 bg-black border border-gray-800 shadow rounded-xl text-white">
      <h2 className="text-2xl font-bold text-[#F4A300] text-center">Login</h2>

      <input
        className="w-full p-2 bg-gray-900 border rounded text-white"
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 bg-gray-900 border rounded text-white"
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

      <button
        onClick={login}
        className="w-full bg-[#F4A300] text-black py-2 rounded hover:bg-yellow-500 transition"
      >
        Entrar como Admin
      </button>

      <div className="border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        ou
      </div>

      <button
        onClick={entrarComoVisitante}
        className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition"
      >
        Entrar como Visitante
      </button>

      <div className="text-center text-sm text-gray-400 mt-4">
        Não tem uma conta?{' '}
        <Link to="/register" className="text-[#F4A300] hover:underline">
          Criar conta
        </Link>
      </div>
    </div>
  );
}

export default Login;

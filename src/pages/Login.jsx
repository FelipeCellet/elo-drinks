import { useState } from 'react';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo-elo.png'; // ajuste o caminho conforme a localização do seu logo

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate('/admin');
    } catch (e) {
      setErro('Credenciais inválidas');
    }
  };

  const entrarComoVisitante = async () => {
    try {
      await signInAnonymously(auth);
      navigate('/');
    } catch (error) {
      console.error("Erro ao entrar como visitante:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-md space-y-6 p-8 bg-white border border-gray-200 shadow-xl rounded-2xl text-black">
        <div className="flex flex-col items-center space-y-4">
          <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
          <h2 className="text-3xl font-extrabold text-[#F4A300] text-center">Bem-vindo de volta</h2>
          <p className="text-sm text-gray-500">Faça login para acessar o painel</p>
        </div>

        <div className="space-y-4">
          <input
            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {erro && (
            <p className="text-red-600 text-sm text-center font-medium">{erro}</p>
          )}

          <button
            onClick={login}
            className="w-full bg-[#F4A300] text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition"
          >
            Entrar
          </button>
        </div>

        <div className="border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
          ou
        </div>

        <button
          onClick={entrarComoVisitante}
          className="w-full bg-gray-100 text-black py-3 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Entrar como Visitante
        </button>

        <div className="text-center text-sm text-gray-500 mt-4">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-[#F4A300] hover:underline font-medium">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

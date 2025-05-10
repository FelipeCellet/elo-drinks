import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const registrar = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      navigate('/');
    } catch (e) {
      setErro('Erro ao criar conta. Verifique o email e senha.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-6 p-6 bg-black border border-gray-800 shadow rounded-xl text-white">
      <h2 className="text-2xl font-bold text-[#F4A300] text-center">Criar Conta</h2>

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
        onClick={registrar}
        className="w-full bg-[#F4A300] text-black py-2 rounded hover:bg-yellow-500 transition"
      >
        Registrar
      </button>

      <button
        onClick={() => navigate('/login')}
        className="w-full mt-2 bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition"
      >
        Voltar para o Login
      </button>
    </div>
  );
}

export default Register;

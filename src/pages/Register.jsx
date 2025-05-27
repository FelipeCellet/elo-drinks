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
    <div className="min-h-screen bg-white flex justify-center items-start pt-20 px-4">
      <div className="w-full max-w-sm space-y-6 p-6 bg-white border border-gray-300 shadow rounded-xl text-black">
        <h2 className="text-2xl font-bold text-[#F4A300] text-center">Criar Conta</h2>

        <input
          className="w-full p-2 bg-white border border-gray-300 rounded text-black"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 bg-white border border-gray-300 rounded text-black"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && <p className="text-red-600 text-sm text-center">{erro}</p>}

        <button
          onClick={registrar}
          className="w-full bg-[#F4A300] text-black py-2 rounded hover:bg-yellow-500 transition"
        >
          Registrar
        </button>

        <button
          onClick={() => navigate('/login')}
          className="w-full mt-2 bg-gray-100 text-black py-2 rounded hover:bg-gray-200 transition"
        >
          Voltar para o Login
        </button>
      </div>
    </div>
  );
}

export default Register;

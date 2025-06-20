import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-elo.png'; 

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
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-md space-y-6 p-8 bg-white border border-gray-200 shadow-xl rounded-2xl text-black">
        <div className="flex flex-col items-center space-y-4">
          <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
          <h2 className="text-3xl font-extrabold text-[#F4A300] text-center">Criar Conta</h2>
          <p className="text-sm text-gray-500">Cadastre-se para começar a usar a plataforma</p>
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
            onClick={registrar}
            className="w-full bg-[#F4A300] text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition"
          >
            Registrar
          </button>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full mt-2 bg-gray-100 text-black py-3 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Voltar para o Login
        </button>
      </div>
    </div>
  );
}

export default Register;

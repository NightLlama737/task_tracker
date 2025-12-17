import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const Register = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
  e.preventDefault();
  const success = await register(username, password);
  if (success) navigate('/dashboard');
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrace</h2>
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Registrovat</button>
    </form>
  );
};

export default Register;

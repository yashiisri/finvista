

// import React, { useState } from 'react';
// import './login.css';
// import { useNavigate } from 'react-router-dom';
// import { FcGoogle } from 'react-icons/fc';

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await fetch('http://localhost:5000/api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();
//     console.log('📦 Login response data:', data); // ✅ DEBUGGING LINE

//     if (res.ok) {
//       alert('✅ Login Successful');

//       localStorage.setItem('userId', data.userId);
//       localStorage.setItem('userEmail', email);

//       // ✅ Handle missing name safely
//       if (data.name) {
//         localStorage.setItem('userName', data.name);
//       } else {
//         console.warn('⚠️ No name returned from backend!');
//         localStorage.setItem('userName', 'User'); // Fallback
//       }

//       navigate('/dashboard');
//     } else {
//       alert(data.error || 'Login failed');
//     }
//   } catch (err) {
//     console.error(err);
//     alert('An error occurred');
//   }
// };


//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <h2 className="login-title">Welcome Back 👋</h2>
//         <p className="login-sub">Login to FinVista</p>

//         <form onSubmit={handleLogin} className="login-form">
//           <input
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <input
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button type="submit">Login</button>
//         </form>

//         <div className="or-divider">or</div>

//         <button className="google-btn" disabled>
//           <FcGoogle className="google-icon" />
//           Login with Google (Coming Soon)
//         </button>

//         <p className="login-footer">
//           Don't have an account? <a href="/register">Sign up</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { auth, provider, signInWithPopup } from '../firebase';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Login Successful');
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', data.name || 'User');
        navigate('/dashboard');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch('http://localhost:5000/api/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
        }),
      });

      const data = await res.json();

      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userName', data.name);

      alert('✅ Logged in with Google');
      navigate('/dashboard');
    } catch (err) {
      console.error('Google Auth Error:', err);
      alert('❌ Google Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-sub">Login to FinVista</p>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <div className="or-divider">or</div>

        <button className="google-btn" onClick={handleGoogleAuth}>
          <FcGoogle className="google-icon" />
          Login with Google
        </button>

        <p className="login-footer">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import LoginPage from './pages/auth/login/LoginPage';

// app.jsx is the furniture, nandito yung mga routes for each pages ng app/web 

function App() {
  return (
    <div className='flex max-w-6xl mx-auto'>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} /> 
      </Routes>
    </div> 
  );
}

export default App;

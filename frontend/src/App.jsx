import { Route, Routes, Navigate } from 'react-router-dom';
import Landing from './pages/landing';
import AdminTables from './pages/admintables';
import StaffTables from './pages/stafftables';
import SignIn from './pages/signin';
import SignUp from './pages/signup';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/admintables" element={<AdminTables/>} />
      <Route path="/stafftables" element={<StaffTables/>} />
      <Route path="/signin" element={<SignIn/>} />
      <Route path="/signup" element={<SignUp/>} />
    </Routes>
  )
}

export default App

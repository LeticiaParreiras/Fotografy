import { Routes, Route} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import Home from "./pages/home";
import { UserPage } from "./pages/UserPage";
import { RootRedirect } from "./components/RootRedirect";
import { ForgotPasswordPage } from "./pages/Forgotpasswordpage";
import { SettingsPage } from "./pages/SettingsPage";



export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<RootRedirect />} />
        <Route path="/*" element={<RootRedirect />} />      
        <Route path="/profile/:username" element={<UserPage/>}/>
        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        
    </Routes>
  );
}

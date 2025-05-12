import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AuthenticateWithRedirectCallback, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from './components/ui/button';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/Homepage';
import AuthCallbackPage from './pages/auth-callback/AuthCallback';
import MainLayout from './Layout/mainLayout';
import ChatPage from './pages/chatPage/ChatPage';

function App() {


  return (
    <Routes>
      <Route
        path='/sso-callback'
        element={<AuthenticateWithRedirectCallback
          signUpForceRedirectUrl={"/auth-callback"} />}
      />
      <Route path="/auth-callback" element={<AuthCallbackPage />} />

      <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path='/chat' element={<ChatPage />} />
      </Route>
    </Routes>
  )
}

export default App

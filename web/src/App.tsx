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
import AlbumPage from './pages/album/AlbumPage';
import AdminPage from './pages/admin/AdminPage';
import { Toaster } from 'react-hot-toast';
import PlaylistPage from './pages/playlist/Playlist';
import SearchPage from './pages/search/SearchPage';

function App() {


  return (
  <>
    <Routes>
      <Route
        path='/sso-callback'
        element={<AuthenticateWithRedirectCallback
          signUpForceRedirectUrl={"/auth-callback"} />}
      />
      <Route path="/auth-callback" element={<AuthCallbackPage />} />
      <Route path="/admin" element={<AdminPage />} />


      <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/albums/:id' element={<AlbumPage />} />
          <Route path="/playlists/:id" element={<PlaylistPage />} />
          <Route path="/search" element={<SearchPage />} />
      </Route>
    </Routes>
    <Toaster/>
    </>
  )
}

export default App

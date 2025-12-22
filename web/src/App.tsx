import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Route, Routes } from 'react-router-dom';
import './App.css';
import MainLayout from './Layout/mainLayout';
import AdminPage from './pages/admin/AdminPage';
import AIPage from './pages/ai/AIPage';
import AlbumPage from './pages/album/AlbumPage';
import AuthCallbackPage from './pages/auth-callback/AuthCallback';
import ChatPage from './pages/chatPage/ChatPage';
import HomePage from './pages/home/Homepage';
import { Toaster } from 'react-hot-toast';
import PlaylistPage from './pages/playlist/Playlist';
import ProfilePage from './pages/profile/ProfilePage';
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
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/ai" element={<AIPage />} />
      </Route>
    </Routes>
    <Toaster/>
    </>
  )
}

export default App

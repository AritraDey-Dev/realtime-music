import { useSignIn } from '@clerk/clerk-react';
import React from 'react'
import { Button } from './ui/button';

const SignedInAuthButton = () => {
    const {signIn,isLoaded}=useSignIn();

    if(!isLoaded){
        return null;
    }
  const signInwithoogle=()=>{
    signIn.authenticateWithRedirect({
        strategy:"oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/auth-callback",
    });
  };

  return (
    <Button onClick={signInwithoogle} variant={"secondary"}
    className='w-full text-white border-zinc-200 h-1'>
      Continue with Google
    </Button>
  );
}

export default SignedInAuthButton;
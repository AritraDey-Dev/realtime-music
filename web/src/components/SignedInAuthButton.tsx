import { useSignIn } from '@clerk/clerk-react';
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
	<Button onClick={signInwithoogle} variant={"secondary"} className='text-white border-zinc-200 h-11'>
			<img src='/google.png' alt='Google' className='size-5' />
			Continue with Google
		</Button>
  );
}

export default SignedInAuthButton;
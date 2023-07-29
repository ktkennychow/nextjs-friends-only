import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utilities/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

const Login = () => {
  const router = useRouter();
  const [secret, setSecret] = useState('')
  const [secretInput, setSecretInput] = useState('')
  const [user, loading] = useAuthState(auth);

  //SIGN IN WITH GOOGLE
  const googleAuthProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  //useEffect
  useEffect(() => {
    setSecret(process.env.NEXT_PUBLIC_INVITECODE)
    if (user) {
      router.push("/");
    } else {
    }
  }, [user]);

  return (
    <div className='p-10 text-white rounded-lg shadow-xl shadow-blue-500 hover:shadow-blue-600'>
      {secretInput === secret ?
        <>
          <h2 className=' font-medium'>Welcome to this my secret message board 🤫</h2>
          <div className='py-4'>
            <button
              onClick={GoogleLogin}
              className='bg-white text-gray-500 w-full font-medium rounded-lg flex align-middle p-4 shadow-md shadow-blue-500 hover:shadow-blue-600'
            >
              <FcGoogle className='text-2xl mr-2'/>
              Sign in with Google
            </button>
          </div>
        </> :
        <>
          <form >
            <label className=''>
              Invitation Code: {''}
              <input type="text" value={secretInput} onChange={(e)=> setSecretInput(e.target.value)} placeholder={`maybe your friend's birthday?`} className='p-4 rounded-md w-full text-gray-500 my-4' />
            </label>
          </form>
        </>
      }
    </div>
  );
};

export default Login;

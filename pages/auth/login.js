import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utilities/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

const Login = () => {
	const router = useRouter();
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
		if (user) {
			
			router.push("/");
		} else {
			console.log("login")
		}
	}, [user]);

	return (
		<div className='shadow-xl mt-32 p-10 text-gray-700 rounded-lg'>
			<h2 className='text-2xl font-medium'>Join Today</h2>
			<div className='py-4'>
				<h3 className='py-4'>Sign in</h3>
				<button
					onClick={GoogleLogin}
					className='text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4'
				>
					<FcGoogle className='text-2xl mr-2' />
					Sign in with Google
				</button>
			</div>
		</div>
	);
};

export default Login;

import Link from "next/link";
import { auth } from "../utilities/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Nav = () => {
	const [user, loading] = useAuthState(auth);

	return (
		<nav className='flex justify-between items-center p-10 mt-10 bg-blue-400 rounded-md'>
			<Link href={"/"} className='text-lg font-medium'>
				<button className='text-3xl font-medium text-white'>Friend Board</button>
			</Link>
			<div className='flex items-center gap-10'>
				{!user && (
					<Link href='/auth/login'>
						<button className='py-2 px-4 text-sm bg-blue-500 text-white rounded-lg font-medium ml-8'>
							Join Now
						</button>
					</Link>
				)}
				{user && (
					<div className='flex items-center gap-6'>
						<Link href='/post'>
							<button className='py-2 px-4 text-sm bg-white text-blue-300 rounded-mg font-medium rounded-md'>
								Post
							</button>
						</Link>

						<Link href='/dashboard'>
							<img
								src={user.photoURL}
								className='w-16 rounded-full cursor-pointer border-4 border-white'
							/>
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Nav;

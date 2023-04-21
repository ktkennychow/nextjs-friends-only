import Link from "next/link";
import { auth } from "../utilities/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Nav = () => {
	const [user, loading] = useAuthState(auth);

	return (
		<nav className='flex justify-between items-center py-10'>
			<Link href={"/"} className='text-lg font-medium'>
				<button className='text-lg font-medium'>Creative Minds</button>
			</Link>
			<ul className='flex items-center gap-10'>
				{!user && (
					<Link href='/auth/login'>
						<button className='py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8'>
							Join Now
						</button>
					</Link>
				)}
				{user && (
					<div className='flex items-center gap-6'>
						<Link href='/post'>
							<button className='py-2 px-4 text-sm bg-cyan-500 text-white rounded-mg font-medium'>
								Post
							</button>
						</Link>

						<Link href='/dashboard'>
							<img
								src={user.photoURL}
								className='w-12 rounded-full cursor-pointer'
							/>
						</Link>
					</div>
				)}
			</ul>
		</nav>
	);
};

export default Nav;

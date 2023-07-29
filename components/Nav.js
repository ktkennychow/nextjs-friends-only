import Link from "next/link";
import { auth } from "../utilities/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Nav = () => {
	const [user, loading] = useAuthState(auth);

	return (
    <nav className='flex justify-between items-center p-10 mt-10 bg-blue-400 rounded-md shadow-xl shadow-blue-500 hover:shadow-blue-600 h-36'>
			<Link href={"/"} className='text-lg font-medium'>
				<button className='text-3xl font-medium text-white'>OnlyFriends</button>
			</Link>
			<div className='flex items-center gap-10'>
				{!user && (
					<Link href='/auth/login'>
            <button className='py-2 px-4 text-sm bg-blue-500 text-white rounded-md font-medium ml-8 shadow-md shadow-blue-500 hover:shadow-blue-600'>
							Join Now
						</button>
					</Link>
				)}
				{user && (
					<div className='flex items-center gap-4'>
						<Link href='/post'>
              <button className='py-2 px-4 text-sm bg-white text-blue-400 rounded-mg font-medium rounded-md shadow-md shadow-blue-500 hover:shadow-blue-600'>
								Post
							</button>
						</Link>

						<Link href='/dashboard'>
							<img
								src={user.photoURL}
                className='w-16 rounded-full cursor-pointer border-4 border-white shadow-md shadow-blue-500 hover:shadow-blue-600'
							/>
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Nav;

import { auth, db } from "../utilities/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	where,
} from "firebase/firestore";
import Message from "../components/Message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";
import { toast } from "react-toastify";

const Dashboard = () => {
	const router = useRouter();
	const [user, loading] = useAuthState(auth);
	const [posts, setPosts] = useState([]);

	//See if user is logged in
	const getData = async () => {
		if (loading) {
			return;
		}
		if (!user) {
			return router.push("/auth/login");
		}
		const collectionRef = collection(db, "posts");
		const q = query(collectionRef, where("user", "==", user.uid));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			setPosts(
				snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
			);
		});
		return unsubscribe;
	};

	//Delete Post
	const deletePost = async (id) => {
		const docRef = doc(db, "posts", id);
		await deleteDoc(docRef);
		toast.success("Successfully deleted your post!! 🤫", {
			position: toast.POSITION.BOTTOM_RIGHT,
			autoClose: 1500,
		});
	};

	//Get users data
	useEffect(() => {
		getData();
	}, [user, loading]);

	return (
		<div>
			<h1>Your posts</h1>
			<div>
				{posts.map((post) => {
					return (
						<Message key={post.id} {...post}>
							<div className='flex gap-4 pt-4'>
								<Link href={{ pathname: "/post", query: post }}>
									<button className='flex text-teal-600 items-center justify-center gap-2 text-sm'>
										<AiFillEdit className='text-2xl' />
										Edit
									</button>
								</Link>

								<button
									onClick={() => deletePost(post.id)}
									className='flex text-pink-600 items-center justify-center gap-2 text-sm'
								>
									<BsTrash2Fill className='text-xl' />
									Delete
								</button>
							</div>
						</Message>
					);
				})}
			</div>
			<button
				className='font-medium text-white bg-gray-800 py-2 px-4 my-6'
				onClick={() => auth.signOut()}
			>
				Signout
			</button>
		</div>
	);
};
export default Dashboard;

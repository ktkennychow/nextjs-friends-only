import { auth, db } from "../utilities/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Timestamp, addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const Post = () => {
	//States
	const [post, setPost] = useState({ description: "" });
	const [user, loading] = useAuthState(auth);
	const router = useRouter();
	const routerData = router.query;
	console.log(router);
	//Submit Post
	const submitPost = async (e) => {
		e.preventDefault();
		// Run checks for description
		if (!post.description) {
			toast.error("Oops! You forgot to type something I guess? 😅", {
				position: toast.POSITION.BOTTOM_RIGHT,
				autoClose: 1500,
			});

			return;
		}
		if (post.description.length > 300) {
			toast.error(
				"Oops! The post is too long. Try to get it under 300! 😅",
				{
					position: toast.POSITION.BOTTOM_RIGHT,
					autoClose: 1500,
				}
			);

			return;
		}

		if (routerData.id) {
			const docRef = doc(db, "posts", post.id);
			const updatedPost = { ...post, timestamp: Timestamp.now() };
			await updateDoc(docRef, updatedPost);
			toast.success("Successfully updated your post!! 😎", {
				position: toast.POSITION.BOTTOM_RIGHT,
				autoClose: 1500,
			});
			return router.push("/");
		} else {
			// Make a new post
			const collectionRef = collection(db, "posts");
			await addDoc(collectionRef, {
				...post,
				timestamp: Timestamp.now(),
				user: user.uid,
				avatar: user.photoURL,
				username: user.displayName,
			});
			setPost({ description: "" });
			toast.success("You post has been made!! 🙌🏼", {
				position: toast.POSITION.BOTTOM_RIGHT,
				autoClose: 1500,
			});
			return router.push("/");
		}
	};

	// Check current user
	const checkUser = async () => {
		if (loading) {
			return;
		}
		if (!user) {
			router.push("/auth/login");
		}
		if (routerData.id) {
			setPost({ description: routerData.description, id: routerData.id });
		}
	};

	useEffect(() => {
		checkUser();
	}, [user, loading]);

	return (
		<div className='my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto'>
			<form onSubmit={submitPost}>
				<h1 className='text-2xl font-bold'>
					{routerData.id ? "Edit your post" : "Create a new post"}
				</h1>
				<div className='py-2'>
					<h3 className='text-lg font-medium py-2'>Description</h3>
					<textarea
						value={post.description}
						onChange={(e) =>
							setPost({ ...post, description: e.target.value })
						}
						className='bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm'
					></textarea>
					<p
						className={`text-cyan-600 font-medium text-sm ${
							post.description.length > 300 ? "text-red-600" : ""
						}`}
					>
						{post.description.length}/300
					</p>
				</div>
				<button
					type='submit'
					className='w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm'
				>
					Submit
				</button>
			</form>
		</div>
	);
};

export default Post;

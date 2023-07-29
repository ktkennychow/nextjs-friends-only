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


	const checkCurrentUser = async () => {
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
		checkCurrentUser();
	}, [user, loading]);

	return (
    <div className='my-20 p-12 rounded-lg max-w-md mx-auto shadow-xl shadow-blue-500 hover:shadow-blue-600 text-white'>
			<form onSubmit={submitPost}>
				<h1 className='text-2xl'>
					{routerData.id ? "Edit your post" : "Create a new post"}
				</h1>
				<div className='py-2'>
					<textarea
						value={post.description}
						onChange={(e) =>
							setPost({ ...post, description: e.target.value })
						}
            className='bg-blue-300 h-48 w-full rounded-lg p-2 text-sm shadow-inner shadow-blue-600 hover:shadow-blue-700'
					></textarea>
					<p
						className={`font-medium text-sm ${
							post.description.length > 300 ? "text-red-600" : ""
						}`}
					>
						{post.description.length}/300
					</p>
				</div>
				<button
					type='submit'
          className='w-full bg-blue-500 font-medium p-2 my-2 rounded-lg text-sm shadow-md shadow-blue-500 hover:shadow-blue-600'
				>
					Submit
				</button>
			</form>
		</div>
	);
};

export default Post;

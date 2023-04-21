import Message from "../components/Message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utilities/firebase";
import { toast } from "react-toastify";
import {
	arrayUnion,
	doc,
	getDoc,
	onSnapshot,
	Timestamp,
	updateDoc,
} from "firebase/firestore";

const Details = () => {
	const router = useRouter();
	const routerData = router.query;
	const [comment, setComment] = useState("");
	const [allComments, setAllComments] = useState([]);
	// Submit a comment
	const subComment = async () => {
		// Check if the user is logged in
		if (!auth.currentUser) {
			return router.push("/auth/login");
		}
		if (!comment.trim()) {
			toast.error("Seems like you forgot to type! 🤭", {
				position: toast.POSITION.BOTTOM_RIGHT,
				autoClose: 1500,
			});
			return;
		}
		const docRef = doc(db, "posts", routerData.id);
		await updateDoc(docRef, {
			comments: arrayUnion({
				description: comment,
				avatar: auth.currentUser.photoURL,
				username: auth.currentUser.displayName,
				timestamp: Timestamp.now(),
			}),
		});
		setComment("");
	};

	// Get comments
	const getComments = async () => {
		const docRef = doc(db, "posts", routerData.id);
		const unsubscribe = onSnapshot(docRef, (snapshot) => {
			setAllComments(snapshot.data().comments);
		});
		return unsubscribe;
	};

	useEffect(() => {
		if (!router.isReady) {
			return;
		}
		getComments();
	}, [router.isReady]);

	return (
		<div>
			<Message {...routerData}></Message>
			<div className='my-4'>
				<div className='flex'>
					<input
						onChange={(e) => setComment(e.target.value)}
						type='text'
						value={comment}
						placeholder='Leave a comment 📝'
						className='bg-gray-800 text-white w-full p-2 text-sm'
					></input>
					<button
						onClick={subComment}
						className='bg-cyan-500 text-white py-2 px-4 text-sm'
					>
						Submit
					</button>
				</div>
				<div className='py-6'>
					<h2 className='font-bold'>Comments</h2>
					{allComments?.map((comment) => (
						<div
							className='bg-white p-4 my-4 border-2'
							key={comment.timestamp}
						>
							<div className='flex items-center gap-2 mb-4'>
								<img
									src={comment.avatar}
									alt=''
									className='w-10 rounded-full'
								/>
								<h2>{comment.username}</h2>
							</div>
							<p>{comment.description}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Details;

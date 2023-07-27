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
      <div className='flex mt-10 justify-between'>
        <h2 className='text-xl font-medium bg-blue-400 text-white px-10 py-5 rounded-t-xl'>Your posts</h2>
        <button
          className='text-xl font-medium  text-blue-400 py-5 px-10'
          onClick={() => auth.signOut()}
        >
          Signout
        </button>
      </div>
      <div className='mb-12 bg-blue-400 p-10 flex flex-col gap-5 rounded-xl rounded-tl-none'>
        {posts.map((post) => {
          return (
            <Message key={post.id} {...post}>
              <div className='flex gap-4 pt-4'>
                <Link href={{ pathname: "/post", query: post }}>
                  <button className='flex text-blue-600 items-center justify-center gap-2 text-sm'>
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

    </div >
  );
};
export default Dashboard;

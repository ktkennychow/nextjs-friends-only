import Head from "next/head";
import Message from "../components/Message";
import { useEffect, useState } from "react";
import { db } from "../utilities/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Link from "next/link";

export default function Home() {
  // States
  const [allPosts, setAllPosts] = useState([]);

  // Functions
  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className='shadow-xl shadow-blue-500 hover:shadow-blue-600 rounded-md'>
      <Head>
        <title>FriendsOnly</title>
        <meta
          name='description'
          content='Connect with your friends'
        />
      </Head>
      <h2 className='ml-10 inline-block text-sm md:text-base font-medium bg-white text-blue-400 py-3 px-6 mt-10 rounded-t-xl'>See what's poppin'</h2>
      <div className='mb-12 bg-blue-400 p-10 flex flex-col gap-5 rounded-xl rounded-tl-none'>
        {allPosts.length === 0 &&
          (<div className="bg-white p-8 border-b-2 rounded-lg">
            There is no post yet or your are not signed in
          </div>
          )
        }
        {allPosts.map((post) => {
          return (
            <Message key={post.id} {...post}>
              <Link
                href={{
                  pathname: `/${post.id}`,
                  query: { ...post },
                }}
              >
                <button>
                  {post.comments?.length > 0
                    ? post.comments?.length
                    : 0}{" "}
                  comments
                </button>
              </Link>
            </Message>
          );
        })}
      </div>
    </div>
  );
}

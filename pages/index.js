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

  console.log(allPosts)
  return (
    <div className=''>
      <Head>
        <title>Friend Board</title>
        <meta
          name='description'
          content='Connect with your friends'
        />
      </Head>

      <h2 className='inline-block text-xl font-medium border-blue-400 border-8 border-b-0 text-blue-400 py-4 px-8 mt-10 rounded-t-xl'>See what other people are saying</h2>
      <div className='mb-12 bg-blue-400 p-10 flex flex-col gap-5 rounded-md rounded-tl-none'>
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

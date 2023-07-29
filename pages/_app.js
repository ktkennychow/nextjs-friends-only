import "../styles/globals.css";
import Layout from "../components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className='bg-blue-400 w-full min-h-full absolute'>
      <div className='mx-6 md:max-w-2xl md:mx-auto font-poppins'>
        <Layout />
        <ToastContainer limit={1} />
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;

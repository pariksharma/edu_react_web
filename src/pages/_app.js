import "../styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { userLoggedIn } from '@/utils/helpers';


export default function App({ Component, pageProps }) {

  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = userLoggedIn();
    const currentPath = router.pathname;
    if(!isLoggedIn) {
      // console.log("hey")
      if(currentPath.startsWith('/private')){
        router.push('/')
      }
    }
  }, [router])

  return <Provider store={store} >
      <Component {...pageProps} />
    </Provider>
}
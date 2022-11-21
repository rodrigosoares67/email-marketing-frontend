import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppProvider } from '../data/contexts/AppContext'

import { initializeApp} from 'firebase/app';
import { config } from '../config/config';
import AuthRoute from '../components/auth/AuthRoute';

initializeApp(config.firebaseConfig)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <AuthRoute>
        <Component {...pageProps} />
      </AuthRoute>
    </AppProvider>
  )
}

export default MyApp

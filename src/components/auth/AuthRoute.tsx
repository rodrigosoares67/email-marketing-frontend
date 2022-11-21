import React, { ReactComponentElement, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export interface IAuthRouteProps {
  children: any
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props;
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const router = useRouter()

  useEffect(() => {
    console.log("AUTH ROUTE")
    AuthCheck();
    //return () => AuthCheck();
  }, [])

  const AuthCheck = async () => {
    onAuthStateChanged(auth, (user) => {
      if(user){
        setLoading(false)
      } else {
        console.log('Acesso não autorizado')
        router.push("/autenticacao")
      }
    })
  }

  if(loading) {
    return <p>Carregando...</p>
  }

  return <>{children}</>
};

export default AuthRoute;

import '../styles/globals.css'
import { GetServerSideProps } from 'next'
import Navbar from '../components/Navbar'
import { UserContext } from '../lib/context'
import { useUserData } from '../lib/hooks'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'//listen to current user


function MyApp({ Component, pageProps }) {

  const userData = useUserData();

  return (<>
    <UserContext.Provider value={userData}>
      <Navbar />
      < Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  </>)


}

export default MyApp

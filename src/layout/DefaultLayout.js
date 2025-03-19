import React,{useEffect, useState} from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { auth } from "../api/firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const DefaultLayout = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up the authentication state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // If user is signed in, set user state
      } else {
        setUser(null); // If user is signed out, set user state to null
        window.location.href = "#/verifikasi"
      }
    });
    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);


  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout

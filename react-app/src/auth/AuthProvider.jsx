import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Get or create user document
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserDoc(userData);
          
          // Apply dark mode for admins
          if (userData.isAdmin) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          
          // Redirect admins to admin panel, regular users to profile
          if (userData.isAdmin && window.location.pathname === '/') {
            window.location.href = '/admin';
          } else if (!userData.isAdmin && window.location.pathname === '/admin') {
            window.location.href = '/';
          }
        } else {
          // Create new user document
          const newUserData = {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            isAdmin: false,
            verificationStatus: 'new',
            createdAt: serverTimestamp()
          };
          
          await setDoc(userDocRef, newUserData);
          setUserDoc(newUserData);
          document.documentElement.classList.remove('dark');
        }
      } else {
        setUser(null);
        setUserDoc(null);
        document.documentElement.classList.remove('dark');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's display name in the user document
      const userDocRef = doc(db, 'users', result.user.uid);
      const newUserData = {
        email: result.user.email,
        displayName: displayName,
        photoURL: null,
        isAdmin: false,
        verificationStatus: 'new',
        createdAt: serverTimestamp()
      };
      await setDoc(userDocRef, newUserData);
    } catch (error) {
      console.error('Email sign up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userDoc,
    isAdmin: userDoc?.isAdmin || false,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

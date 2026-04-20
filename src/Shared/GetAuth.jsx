import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getIdToken, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

const GetAuth = () => {
    const [token, setToken] = useState("");
    const [user, loading] = useAuthState(auth);
    useEffect(() => {
        const unSubscribed = onAuthStateChanged(auth, (user) => {
            if (user) {
                getIdToken(user).then((idToken) => setToken(idToken));
            }
        });
        return () => unSubscribed;
    }, []);

    return { user, loading, token };
};

export default GetAuth;

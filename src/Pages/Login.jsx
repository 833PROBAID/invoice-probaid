import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../Shared/firebaseConfig";
import Seo from "../Components/SEO";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Firebase auth hook
  const [signInWithEmailAndPassword, user, loading, firebaseError] =
    useSignInWithEmailAndPassword(auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Clear any previous errors
    setError("");

    try {
      // Attempt login
      await signInWithEmailAndPassword(email, password);
    } catch (err) {
      console.error("Error during login:", err);
      setError(
        "Failed to log in. Please check your credentials and try again.",
      );
    }
    setIsLoading(false);
  };

  // Handle errors from Firebase
  const renderErrorMessage = () => {
    if (firebaseError) {
      switch (firebaseError.code) {
        case "auth/invalid-email":
          return "The email address is not valid.";
        case "auth/user-not-found":
          return "No user found with this email.";
        case "auth/wrong-password":
          return "Incorrect password.";
        default:
          return "An error occurred during login. Please try again.";
      }
    }
    return error;
  };

  // If the user is logged in, redirect them to the dashboard (use React Router or similar)
  if (user) {
    // Redirect to the dashboard (replace with your router logic)
    window.location.href = "/dashboard";
  }

  return (
    <>
      <Seo
        title="Login"
        description="Login to your account"
        pathname="/login"
      />
      <div className="h-screen flex items-center justify-center bg-tealSoft">
        <div className="min-w-[300px] max-w-md p-6 w-full">
          <h2 className="text-3xl font-bold text-center text-colorTeal mb-6">
            Login
          </h2>

          {renderErrorMessage() && (
            <p className="text-red-500 text-center mb-4">
              {renderErrorMessage()}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-bold text-colorTeal"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-colorOrange rounded focus:outline-none focus:border-colorTeal"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-bold text-colorTeal"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-colorOrange rounded focus:outline-none focus:border-colorTeal"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="w-full py-2 bg-colorTeal text-white rounded hover:bg-colorOrange transition duration-200"
                disabled={isLoading || loading}
              >
                {isLoading || loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

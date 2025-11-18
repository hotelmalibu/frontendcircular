import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  // When used as a wrapper, render the children if authenticated
  return user ? children : <Navigate to="/login" replace />;
}

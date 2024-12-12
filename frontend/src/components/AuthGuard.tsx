import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Redirect to sign-in if no token is found
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;

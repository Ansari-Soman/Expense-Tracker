import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUserSession = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
      if (response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user session info on mount", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const [demoDataEnabled, setDemoDataEnabled] = useState(
    () => localStorage.getItem("demo-data-enabled") === "true"
  );

  const toggleDemoData = () => {
    setDemoDataEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("demo-data-enabled", String(next));
      return next;
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
        loading,
        setLoading,
        refreshSession: checkUserSession,
        demoDataEnabled,
        toggleDemoData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

"use client";

import { useState, useEffect } from "react";
import AdminDashboard from "@/components/ui/admin-dashboard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [authToken, setAuthToken] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    // Check if user is already authenticated
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.authenticated && data.token) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setError("");
        // Store token in localStorage for the session
        localStorage.setItem("adminToken", data.token);
      } else {
        setError(data.error || "Password non valida");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Errore di connessione");
    }
  };

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <>
        <head>
          <meta name="robots" content="noindex, nofollow" />
        </head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold ">
                Accesso Admin
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Accedi
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <AdminDashboard authToken={authToken} />
    </>
  );
}

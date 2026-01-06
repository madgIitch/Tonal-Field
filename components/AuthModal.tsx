"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const supabase = createClient();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split("@")[0],
            },
          },
        });

        if (error) throw error;

        setMessage("Check your email to confirm your account!");
        setEmail("");
        setPassword("");
        setName("");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage("Logged in successfully!");
        setTimeout(() => {
          onClose();
          window.location.reload(); // Reload to update auth state
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-panel auth-modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === "login" ? "Login" : "Create Account"}
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <div className="form-field">
                <label htmlFor="name">Name (optional)</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
              {mode === "signup" && (
                <span className="form-hint">At least 6 characters</span>
              )}
            </div>

            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-success">{message}</div>}

            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
            </button>

            <div className="auth-switch">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => {
                      setMode("signup");
                      setError("");
                      setMessage("");
                    }}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="auth-link"
                    onClick={() => {
                      setMode("login");
                      setError("");
                      setMessage("");
                    }}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

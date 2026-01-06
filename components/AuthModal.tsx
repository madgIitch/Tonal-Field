"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import "./AuthModal.css";

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
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">
            {mode === "login" ? "Login" : "Create Account"}
          </h2>
          <button
            type="button"
            className="auth-modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-modal-form">
          {mode === "signup" && (
            <div className="auth-modal-field">
              <label htmlFor="name" className="auth-modal-label">
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={loading}
                className="auth-modal-input"
              />
            </div>
          )}

          <div className="auth-modal-field">
            <label htmlFor="email" className="auth-modal-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="auth-modal-input"
            />
          </div>

          <div className="auth-modal-field">
            <label htmlFor="password" className="auth-modal-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={loading}
              className="auth-modal-input"
            />
            {mode === "signup" && (
              <span className="auth-modal-helper">At least 6 characters</span>
            )}
          </div>

          {error && <div className="auth-modal-error">{error}</div>}
          {message && <div className="auth-modal-success">{message}</div>}

          <button
            type="submit"
            className="auth-modal-submit"
            disabled={loading}
          >
            {loading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
          </button>

          <div className="auth-modal-footer">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <span
                  className="auth-modal-link"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                    setMessage("");
                  }}
                >
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  className="auth-modal-link"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setMessage("");
                  }}
                >
                  Login
                </span>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

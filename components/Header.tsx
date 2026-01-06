"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { AuthModal } from "./AuthModal";

export function Header() {
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="header">
      <div className="logo-group">
        <img
          src="/icon.png"
          alt=""
          aria-hidden
          style={{ width: "24px", height: "24px", flexShrink: 0 }}
        />
        <Link className="logo" href="/">
          Tonal Field
        </Link>
        <span className="logo-pill">MVP</span>
      </div>
      <nav className="nav">
        <Link href="/">Home</Link>
        <Link href="/system">System</Link>
        <Link href="/studio">Studio</Link>
        <Link href="/guides">Guides</Link>
        <Link href="/community">Community</Link>
        <Link href="/pricing">Plans</Link>
      </nav>
      <div className="header-actions">
        {user ? (
          <>
            {profile?.plan === "free" && (
              <Link className="nav-cta" href="/pricing">
                Upgrade
              </Link>
            )}
            <div className="user-menu-wrapper">
              <button
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                type="button"
              >
                <span className="user-avatar">
                  {profile?.name?.[0]?.toUpperCase() || profile?.email[0]?.toUpperCase() || "U"}
                </span>
                <span className="user-name">{profile?.name || profile?.email}</span>
                {profile?.plan === "pro" && (
                  <span className="user-badge">PRO</span>
                )}
              </button>
              {showUserMenu && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <div className="user-menu-name">{profile?.name || "User"}</div>
                    <div className="user-menu-email">{profile?.email}</div>
                  </div>
                  <div className="user-menu-divider" />
                  <button
                    className="user-menu-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      signOut();
                    }}
                    type="button"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            className="nav-cta"
            onClick={() => setShowAuthModal(true)}
            type="button"
          >
            Login
          </button>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
}

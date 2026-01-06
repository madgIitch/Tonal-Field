"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createCheckoutSession, STRIPE_PRICES } from "@/lib/stripe/stripe-service";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    setLoading(true);

    try {
      const priceId = STRIPE_PRICES[selectedPlan];
      const { url, error } = await createCheckoutSession(priceId, user.id);

      if (error) {
        alert(`Error: ${error}`);
        return;
      }

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error upgrading:", error);
      alert("Failed to start upgrade process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>
            Upgrade to Pro
          </h2>
          <p style={{ fontSize: "14px", opacity: 0.7 }}>
            Unlock advanced features for professional color design
          </p>
        </div>

        {/* Plan Selection */}
        <div style={{ marginBottom: "24px" }}>
          <div
            onClick={() => setSelectedPlan("yearly")}
            style={{
              border: selectedPlan === "yearly" ? "2px solid rgb(59, 130, 246)" : "2px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "12px",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {selectedPlan === "yearly" && (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "rgb(59, 130, 246)",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                SAVE €4
              </div>
            )}
            <div style={{ fontWeight: 600, fontSize: "18px", marginBottom: "4px" }}>
              Yearly
            </div>
            <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>
              €20<span style={{ fontSize: "16px", fontWeight: 400, opacity: 0.7 }}>/year</span>
            </div>
            <div style={{ fontSize: "14px", opacity: 0.7 }}>
              €1.67/month billed annually
            </div>
          </div>

          <div
            onClick={() => setSelectedPlan("monthly")}
            style={{
              border: selectedPlan === "monthly" ? "2px solid rgb(59, 130, 246)" : "2px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: "18px", marginBottom: "4px" }}>
              Monthly
            </div>
            <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>
              €2<span style={{ fontSize: "16px", fontWeight: 400, opacity: 0.7 }}>/month</span>
            </div>
            <div style={{ fontSize: "14px", opacity: 0.7 }}>
              Billed monthly
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>
            What&apos;s included:
          </div>
          <ul style={{ fontSize: "14px", lineHeight: 1.8, paddingLeft: "20px" }}>
            <li>Complete palette kits (all roles)</li>
            <li>Advanced contrast repair</li>
            <li>Unlimited saved palettes</li>
            <li>Dual theme generator</li>
            <li>Color blindness simulator</li>
            <li>Professional exports (CSS, JSON, Tailwind, Figma...)</li>
          </ul>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "14px",
              fontWeight: 600,
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              background: "white",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              borderRadius: "8px",
              background: "rgb(59, 130, 246)",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? "Loading..." : "Continue to Payment"}
          </button>
        </div>

        <div style={{ marginTop: "16px", fontSize: "12px", opacity: 0.6, textAlign: "center" }}>
          Secure payment powered by Stripe
        </div>
      </div>
    </div>
  );
}

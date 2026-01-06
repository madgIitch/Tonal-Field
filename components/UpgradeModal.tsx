"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { createCheckoutSession, STRIPE_PRICES } from "@/lib/stripe/stripe-service";
import "./UpgradeModal.css";

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
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div className="upgrade-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="upgrade-modal-header">
          <h2 className="upgrade-modal-title">Upgrade to Pro</h2>
          <p className="upgrade-modal-subtitle">
            Unlock advanced features for professional color design
          </p>
        </div>

        {/* Plan Selection */}
        <div className="upgrade-plan-selection">
          <div
            onClick={() => setSelectedPlan("yearly")}
            className={`upgrade-plan-option ${selectedPlan === "yearly" ? "selected" : ""}`}
          >
            {selectedPlan === "yearly" && (
              <div className="upgrade-plan-badge">SAVE €4</div>
            )}
            <div className="upgrade-plan-name">Yearly</div>
            <div className="upgrade-plan-price">
              €20<span className="upgrade-plan-price-unit">/year</span>
            </div>
            <div className="upgrade-plan-billing">€1.67/month billed annually</div>
          </div>

          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`upgrade-plan-option ${selectedPlan === "monthly" ? "selected" : ""}`}
          >
            <div className="upgrade-plan-name">Monthly</div>
            <div className="upgrade-plan-price">
              €2<span className="upgrade-plan-price-unit">/month</span>
            </div>
            <div className="upgrade-plan-billing">Billed monthly</div>
          </div>
        </div>

        {/* Features */}
        <div className="upgrade-features">
          <div className="upgrade-features-title">What&apos;s included:</div>
          <ul className="upgrade-features-list">
            <li>Complete palette kits (all roles)</li>
            <li>Advanced contrast repair</li>
            <li>Unlimited saved palettes</li>
            <li>Dual theme generator</li>
            <li>Color blindness simulator</li>
            <li>Professional exports (CSS, JSON, Tailwind, Figma...)</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="upgrade-modal-actions">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="upgrade-btn upgrade-btn-cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={loading}
            className="upgrade-btn upgrade-btn-primary"
          >
            {loading ? "Loading..." : "Continue to Payment"}
          </button>
        </div>

        <div className="upgrade-modal-footer">
          Secure payment powered by Stripe
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createPortalSession } from "@/lib/stripe/stripe-service";

interface User {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro";
  stripe_customer_id: string | null;
}

export function SubscriptionManager() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        console.log("Profile data:", data);
        console.log("Profile error:", error);
        console.log("Has stripe_customer_id:", data?.stripe_customer_id);

        if (data) {
          setUser(data);
        }
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  async function handleManageSubscription() {
    if (!user?.stripe_customer_id) {
      alert("No customer ID found");
      return;
    }

    setPortalLoading(true);
    try {
      const { url, error } = await createPortalSession(user.stripe_customer_id);

      if (error) {
        alert(`Error: ${error}`);
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("Portal error:", err);
      alert("Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="subscription-manager">
        <div className="subscription-card">
          <p>Loading subscription info...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isPro = user.plan === "pro";

  return (
    <div className="subscription-manager">
      <div className="subscription-card">
        <div className="subscription-header">
          <h3>Your Subscription</h3>
          <span className={`plan-badge ${isPro ? "pro" : "free"}`}>
            {isPro ? "Pro" : "Free"}
          </span>
        </div>

        <div className="subscription-details">
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Plan:</span>
            <span className="detail-value">{isPro ? "Tonal Field Pro" : "Free Plan"}</span>
          </div>
          {isPro && user.stripe_customer_id && (
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value status-active">Active</span>
            </div>
          )}
        </div>

        {isPro && (
          <div className="subscription-actions">
            {user.stripe_customer_id ? (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                >
                  {portalLoading ? "Opening..." : "Manage Subscription"}
                </button>
                <p className="subscription-hint">
                  Update payment method, view invoices, or cancel your subscription
                </p>
              </>
            ) : (
              <p className="subscription-hint error">
                No Stripe customer ID found. Please contact support or re-subscribe.
              </p>
            )}
          </div>
        )}

        {!isPro && (
          <div className="subscription-actions">
            <p className="subscription-hint">
              Upgrade to Pro to unlock advanced features and unlimited palettes
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .subscription-manager {
          margin: 40px 0;
        }

        .subscription-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 32px;
          max-width: 600px;
          margin: 0 auto;
        }

        .subscription-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .subscription-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .plan-badge {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .plan-badge.free {
          background: rgba(128, 128, 128, 0.2);
          color: #aaa;
        }

        .plan-badge.pro {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
        }

        .subscription-details {
          margin-bottom: 24px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          opacity: 0.7;
          font-size: 14px;
        }

        .detail-value {
          font-weight: 500;
        }

        .status-active {
          color: #10b981;
        }

        .subscription-actions {
          text-align: center;
          padding-top: 16px;
        }

        .subscription-actions .btn {
          width: 100%;
          margin-bottom: 12px;
        }

        .subscription-hint {
          font-size: 13px;
          opacity: 0.6;
          margin: 0;
          line-height: 1.5;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

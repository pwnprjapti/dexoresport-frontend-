import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaRocket, FaArrowRight, FaGamepad } from "react-icons/fa";
import "../css/App.css";

export default function OrgNotFound({ slug }) {
  // Get root domain link
  const rootDomain = window.location.port 
    ? `${window.location.protocol}//localhost:${window.location.port}`
    : `${window.location.protocol}//${window.location.hostname.split(".").slice(-2).join(".")}`;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c14",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "30px 20px",
      fontFamily: "Inter, sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background neon glow */}
      <div style={{
        position: "absolute",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0, 240, 255, 0.12) 0%, transparent 70%)",
        top: "-100px",
        right: "-100px",
        pointerEvents: "none"
      }} />

      <div style={{
        maxWidth: "600px",
        width: "100%",
        background: "rgba(15, 23, 42, 0.85)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
        padding: "48px 36px",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(12px)",
        position: "relative",
        zIndex: 1
      }}>
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "20px",
          background: "rgba(255, 70, 85, 0.15)",
          border: "1px solid rgba(255, 70, 85, 0.3)",
          color: "#ff4655",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "36px",
          margin: "0 auto 24px auto"
        }}>
          <FaGamepad />
        </div>

        <h1 style={{
          fontSize: "28px",
          fontWeight: "800",
          marginBottom: "12px",
          letterSpacing: "-0.5px"
        }}>
          Organization Not Found
        </h1>

        <p style={{
          color: "#94a3b8",
          fontSize: "16px",
          lineHeight: "1.6",
          marginBottom: "28px"
        }}>
          The organization website <strong style={{ color: "#00f0ff" }}>"{slug}"</strong> does not exist or may have been renamed.
        </p>

        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px dashed rgba(255, 255, 255, 0.15)",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "32px",
          textAlign: "left"
        }}>
          <h4 style={{ color: "#fff", fontSize: "15px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaRocket style={{ color: "#00f0ff" }} /> Are you an Esports Tournament Organizer?
          </h4>
          <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.5", margin: 0 }}>
            You can claim the address <strong style={{ color: "#ffd700" }}>{slug}</strong> and get your own fully automated esports website in under 60 seconds!
          </p>
        </div>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <a 
            href={`${rootDomain}/organizer/signup?claim=${encodeURIComponent(slug || "")}`}
            style={{
              background: "linear-gradient(135deg, #00f0ff 0%, #0077ff 100%)",
              color: "#050914",
              fontWeight: "700",
              fontSize: "15px",
              padding: "14px 24px",
              borderRadius: "10px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 20px rgba(0, 240, 255, 0.3)"
            }}
          >
            Claim This Website <FaArrowRight />
          </a>

          <a 
            href={rootDomain}
            style={{
              background: "rgba(255, 255, 255, 0.07)",
              color: "#fff",
              fontWeight: "600",
              fontSize: "15px",
              padding: "14px 24px",
              borderRadius: "10px",
              textDecoration: "none",
              border: "1px solid rgba(255, 255, 255, 0.15)"
            }}
          >
            Go to Platform Home
          </a>
        </div>
      </div>
    </div>
  );
}

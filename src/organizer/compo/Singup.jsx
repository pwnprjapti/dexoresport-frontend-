import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../css/signup.module.css";
import Toaster from "../compo/toaster.jsx";
import { FaGlobe, FaCheckCircle, FaExternalLinkAlt, FaCopy, FaRocket } from "react-icons/fa";

export default function Signup(){
  const navigate = useNavigate();
  const location = useLocation();

  const [ color, setColor ] = useState();
  const [ bg, setBg ] = useState();
  const [ border, setBorder ] = useState();
  const [ tmsg, setTmsg ] = useState();
  const [ visible, setVisible ] = useState("none");
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  // Success modal state
  const [createdWebsite, setCreatedWebsite] = useState(null);

  const toast = (color, bg, border, tmsg) => {
    setTmsg(tmsg);
    setBorder(border);
    setBg(bg);
    setColor(color);
    setVisible("block");

    setTimeout(()=>{
      setVisible("none");
    }, 3000);
  };

  const [ data, setData ] = useState({
    organizationName: "",
    slug: "",
    name: "",
    email: "",
    password: ""
  });

  // Read claim param if redirected from 404 page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const claim = params.get("claim");
    if (claim) {
      const clean = claim.toLowerCase().replace(/[^a-z0-9]/g, "");
      setData(prev => ({
        ...prev,
        organizationName: clean.charAt(0).toUpperCase() + clean.slice(1) + " Esports",
        slug: clean
      }));
    }
  }, [location.search]);

  const handleOrgNameChange = (e) => {
    const orgName = e.target.value;
    const autoSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "");
    setData(prev => ({
      ...prev,
      organizationName: orgName,
      slug: autoSlug
    }));
  };

  const handleSlugChange = (e) => {
    const rawSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setData(prev => ({ ...prev, slug: rawSlug }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.organizationName || !data.organizationName.trim()) {
      return toast("red", "rgba(255, 0, 0, 0.272)", "red", "Please enter your organization name");
    }
    if (!data.name || !data.name.trim()) {
      return toast("red", "rgba(255, 0, 0, 0.272)", "red", "Please enter your name");
    }
    if (!data.email || !data.email.trim()) {
      return toast("red", "rgba(255, 0, 0, 0.272)", "red", "Please enter your email");
    }
    if (!data.password || data.password.length < 6) {
      return toast("red", "rgba(255, 0, 0, 0.272)", "red", "Password must be at least 6 characters");
    }

    setIsSubmitting(true);

    try {
      const resCSRF = await fetch(`${import.meta.env.VITE_BASE_URL}/getcsrf`, { credentials:'include'});
      const dataCSRF = await resCSRF.json();
     
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/organizer/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': dataCSRF?.csrfToken || ""
        },
        body: JSON.stringify(data)
      });
      const resdata = await res.json();
  
      if (res.status === 400 || res.status === 409) {
        toast("red", "rgba(255, 0, 0, 0.272)", "red", resdata.msg || "Signup error");
        setIsSubmitting(false);
        return;
      }

      if (res.status === 200) {
        if (resdata.token) {
          localStorage.setItem("jwt", resdata.token);
        }
        
        // Build the live website URL
        const hostname = window.location.hostname;
        const port = window.location.port ? `:${window.location.port}` : '';
        let websiteUrl = "";

        if (hostname.includes("localhost") || hostname === "127.0.0.1") {
          websiteUrl = `http://${resdata.slug}.localhost${port}`;
        } else {
          // If on domain.com
          const rootDomain = hostname.split(".").slice(-2).join(".");
          websiteUrl = `https://${resdata.slug}.${rootDomain}`;
        }

        setCreatedWebsite({
          orgName: resdata.organizationName || data.organizationName,
          slug: resdata.slug,
          websiteUrl: websiteUrl,
          directPathUrl: `/o/${resdata.slug}`
        });

        toast("rgb(0, 255, 89)", "rgba(0, 255, 89, 0.24)", "rgb(0, 255, 89)", "Website Created Successfully!");
      }
    } catch (err) {
      console.error("Organizer signup error", err);
      toast("red", "rgba(255, 0, 0, 0.272)", "red", "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyWebsiteUrl = () => {
    if (createdWebsite?.websiteUrl) {
      navigator.clipboard.writeText(createdWebsite.websiteUrl);
      toast("rgb(0, 255, 89)", "rgba(0, 255, 89, 0.24)", "rgb(0, 255, 89)", "URL copied to clipboard!");
    }
  };

  return(
    <>
      <div className={styles.container}>
        <img src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" alt="Dexor" />
        <h1>Create Organizer <span>Website</span></h1>
        <p>Get your own branded esports portal (e.g. <span>{data.slug || "organization"}.mydomain.com</span>) in 60 seconds.</p>
        
        <div className={styles.box}>
          <div style={{ textAlign: "left", width: "100%" }}>
            <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", display: "block" }}>Organization Name</label>
            <input 
              type="text" 
              name="organizationName" 
              value={data.organizationName}
              onChange={handleOrgNameChange} 
              placeholder="e.g. Slayer Esports" 
              required
            />
          </div>

          <div style={{ textAlign: "left", width: "100%" }}>
            <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", display: "block" }}>Your Website Address (Subdomain)</label>
            <div style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(0, 240, 255, 0.3)",
              borderRadius: "8px",
              padding: "2px 10px",
              marginBottom: "12px"
            }}>
              <FaGlobe style={{ color: "#00f0ff", marginRight: "8px", flexShrink: 0 }} />
              <input 
                type="text" 
                name="slug" 
                value={data.slug} 
                onChange={handleSlugChange} 
                placeholder="slayeresport"
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#00f0ff",
                  fontWeight: "700",
                  padding: "8px 0",
                  width: "100%"
                }}
              />
              <span style={{ color: "#94a3b8", fontSize: "13px", whiteSpace: "nowrap" }}>.mydomain.com</span>
            </div>
          </div>

          <div style={{ textAlign: "left", width: "100%" }}>
            <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", display: "block" }}>Organizer / Owner Name</label>
            <input 
              type="text" 
              name="name" 
              value={data.name}
              onChange={handleChange} 
              placeholder="Your Full Name" 
              required
            />
          </div>

          <div style={{ textAlign: "left", width: "100%" }}>
            <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", display: "block" }}>Work / Business Email</label>
            <input 
              type="email" 
              name="email" 
              value={data.email}
              onChange={handleChange} 
              placeholder="organizer@gmail.com" 
              required
            />
          </div>

          <div style={{ textAlign: "left", width: "100%" }}>
            <label style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px", display: "block" }}>Set Password</label>
            <input 
              type="password" 
              name="password" 
              value={data.password}
              onChange={handleChange} 
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <small>By continuing you agree to Dexor <Link to="#">Terms of services</Link> and <Link to="#">Fair-play policy</Link></small>
          
          <Toaster tmsg={tmsg} color={color} bg={bg} border={border} visible={visible} />
          
          <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Provisioning Your Website..." : "Launch My Organization Website"}
          </button>
          
          <p>Already have an account? <Link to="/organizer/login">Organizer Login</Link></p>
        </div>
      </div>

      {/* Website Created Modal Popup */}
      {createdWebsite && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          zIndex: 9999
        }}>
          <div style={{
            maxWidth: "520px",
            width: "100%",
            background: "#0c1322",
            border: "1px solid rgba(0, 240, 255, 0.4)",
            borderRadius: "20px",
            padding: "36px 30px",
            textAlign: "center",
            boxShadow: "0 0 50px rgba(0, 240, 255, 0.25)"
          }}>
            <div style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "rgba(0, 255, 89, 0.15)",
              color: "#00ff59",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              margin: "0 auto 16px auto",
              border: "1px solid rgba(0, 255, 89, 0.4)"
            }}>
              <FaCheckCircle />
            </div>

            <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>
              Your Website is LIVE!
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.5", marginBottom: "22px" }}>
              Congratulations! Your dedicated tournament organization portal for <strong style={{ color: "#00f0ff" }}>{createdWebsite.orgName}</strong> is active.
            </p>

            {/* URL Box */}
            <div style={{
              background: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(0, 240, 255, 0.3)",
              borderRadius: "12px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              marginBottom: "24px"
            }}>
              <span style={{
                color: "#00f0ff",
                fontFamily: "monospace",
                fontSize: "14px",
                fontWeight: "700",
                wordBreak: "break-all"
              }}>
                {createdWebsite.websiteUrl}
              </span>
              <button 
                onClick={copyWebsiteUrl}
                style={{
                  background: "rgba(0, 240, 255, 0.15)",
                  border: "1px solid rgba(0, 240, 255, 0.4)",
                  color: "#00f0ff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flexShrink: 0
                }}
              >
                <FaCopy /> Copy
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a 
                href={createdWebsite.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "linear-gradient(135deg, #00f0ff 0%, #0077ff 100%)",
                  color: "#050914",
                  fontWeight: "700",
                  fontSize: "15px",
                  padding: "14px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <FaExternalLinkAlt /> Visit My Player Website
              </a>

              <button 
                onClick={() => navigate("/organizer/dashboard")}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "15px",
                  padding: "12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <FaRocket /> Open Organizer Console
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
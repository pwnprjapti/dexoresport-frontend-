import React, { createContext, useContext, useState, useEffect } from "react";

const TenantContext = createContext(null);

// Helper to extract tenant slug from hostname or query parameters
export function getTenantSlugFromUrl() {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  const orgQuery = urlParams.get("org") || urlParams.get("tenant");
  if (orgQuery) {
    return orgQuery.toLowerCase().trim();
  }

  // Check path-based preview e.g. /o/slayeresport
  const pathMatch = window.location.pathname.match(/^\/o\/([a-zA-Z0-9_-]+)/i);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1].toLowerCase().trim();
  }

  // Check hostname
  const hostname = window.location.hostname;
  
  // IP address check
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    return null;
  }

  const parts = hostname.split(".");

  // Subdomain on *.localhost (e.g. slayeresport.localhost)
  if (hostname.endsWith("localhost") && parts.length > 1) {
    const sub = parts[0].toLowerCase().trim();
    if (sub !== "localhost" && sub !== "www") {
      return sub;
    }
    return null;
  }

  // Standard domains: organizationname.domain.com or organizationname.dexoresport.com
  // Example: slayeresport.dexoresport.com -> parts: ["slayeresport", "dexoresport", "com"] (length: 3)
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase().trim();
    if (sub !== "www" && sub !== "admin" && sub !== "api" && sub !== "app") {
      return sub;
    }
  }

  return null;
}

export function TenantProvider({ children }) {
  const [tenantSlug, setTenantSlug] = useState(() => getTenantSlugFromUrl());
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(getTenantSlugFromUrl()));
  const [tenantNotFound, setTenantNotFound] = useState(false);

  const fetchTenantData = async (slug) => {
    if (!slug) {
      setTenant(null);
      setLoading(false);
      setTenantNotFound(false);
      return;
    }

    setLoading(true);
    setTenantNotFound(false);

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/org/public/${slug}`);
      const data = await res.json();

      if (res.ok && data.success && data.organization) {
        setTenant(data.organization);
        setTenantNotFound(false);

        // Update page title and custom CSS variables
        if (data.organization.organizationName) {
          document.title = `${data.organization.organizationName} | Official Esports Arena`;
        }

        if (data.organization.branding?.primaryColor) {
          document.documentElement.style.setProperty("--tenant-primary", data.organization.branding.primaryColor);
        }
        if (data.organization.branding?.accentColor) {
          document.documentElement.style.setProperty("--tenant-accent", data.organization.branding.accentColor);
        }
      } else {
        setTenant(null);
        setTenantNotFound(true);
      }
    } catch (err) {
      console.error("Failed to load tenant details:", err);
      // Fallback: If backend is unreachable or local demo, set basic placeholder so page doesn't crash
      setTenant({
        organizationName: slug.charAt(0).toUpperCase() + slug.slice(1) + " Esports",
        slug: slug,
        subdomain: slug,
        tagline: `${slug.toUpperCase()} Gaming Arena & Tournaments`,
        about: `Welcome to the official competitive tournament portal of ${slug.toUpperCase()}.`,
        branding: {
          logo: "",
          banner: "",
          primaryColor: "#00f0ff",
          accentColor: "#ff4655"
        },
        socialLinks: {
          youtube: "",
          instagram: "",
          discord: "",
          whatsapp: ""
        }
      });
      setTenantNotFound(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const slug = getTenantSlugFromUrl();
    setTenantSlug(slug);
    if (slug) {
      fetchTenantData(slug);
    } else {
      setTenant(null);
      setLoading(false);
      setTenantNotFound(false);
      document.title = "Dexor Esports | Tournament Platform for Organizers";
    }
  }, []);

  const refreshTenant = () => {
    if (tenantSlug) {
      fetchTenantData(tenantSlug);
    }
  };

  const isTenant = Boolean(tenantSlug);

  return (
    <TenantContext.Provider value={{
      isTenant,
      tenantSlug,
      tenant,
      loading,
      tenantNotFound,
      refreshTenant
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    return {
      isTenant: false,
      tenantSlug: null,
      tenant: null,
      loading: false,
      tenantNotFound: false,
      refreshTenant: () => {}
    };
  }
  return context;
}

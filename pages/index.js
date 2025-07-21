import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <main style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Mon site Next.js + Stripe + Supabase</h1>
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          padding: "10px 20px",
          background: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {loading ? "Redirection..." : "Payer 10 €"}
      </button>
    </main>
  );
}

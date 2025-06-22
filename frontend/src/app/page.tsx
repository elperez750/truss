"use client";

import Image from "next/image";
import api from "@/lib/api";
import { useState } from "react";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTrades = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await api.get("/trades");
      console.log(response.data);
    } catch (err: any) {
      console.error('Error fetching trades:', err);
      setError(`Error: ${err.response?.status} - ${err.response?.statusText || err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Hello World</h1>
      <p>This is a test</p>
      <button onClick={fetchTrades} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Trades'}
      </button>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}
    </div>
  );
}

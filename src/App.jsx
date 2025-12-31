import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Routes from "./Routes";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // ✅ Always start fresh
      await supabase.auth.signOut();

      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
      setLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return <Routes user={user} />;
};

export default App;

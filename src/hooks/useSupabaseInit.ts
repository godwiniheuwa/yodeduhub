
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabase/client";
import { setupExamTables, isDatabaseReady } from "@/services/supabase/setupTables";

export function useSupabaseInit() {
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [databaseReady, setDatabaseReady] = useState(false);
  
  useEffect(() => {
    // Test Supabase connection and setup database
    const initializeSupabase = async () => {
      try {
        setIsLoading(true);
        
        // First check if we can connect to Supabase
        console.log("Checking Supabase connection...");
        const { error: connectionError } = await supabase.auth.getSession();
        
        if (!connectionError) {
          console.log("Supabase connection successful!");
          setSupabaseConnected(true);
          toast({
            title: "Supabase Connected",
            description: "Your application is successfully connected to Supabase!",
          });
          
          // Check if database is ready
          const dbReady = await isDatabaseReady();
          
          if (dbReady) {
            console.log("Database already set up!");
            setDatabaseReady(true);
          } else {
            console.log("Database needs setup...");
            toast({
              title: "Setting Up Database",
              description: "Creating necessary tables for the application...",
            });
            
            // Set up the database tables
            const setup = await setupExamTables();
            
            if (setup) {
              setDatabaseReady(true);
              toast({
                title: "Database Ready",
                description: "Tables have been created successfully!",
                duration: 5000,
              });
            } else {
              toast({
                title: "Database Setup Failed",
                description: "Could not create all required tables. See console for details.",
                variant: "destructive",
                duration: 5000,
              });
            }
          }
        } else {
          console.error("Supabase connection error:", connectionError);
          toast({
            title: "Supabase Connection Failed",
            description: "Please check your Supabase credentials or internet connection.",
            variant: "destructive",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Error connecting to Supabase:", error);
        toast({
          title: "Supabase Connection Failed",
          description: "Please check your Supabase credentials or internet connection.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeSupabase();
  }, []);
  
  return { isLoading, supabaseConnected, databaseReady, setIsLoading };
}

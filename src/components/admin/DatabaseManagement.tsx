
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { setupExamTables, isDatabaseReady } from "@/services/supabase/setupTables";
import { toast } from "@/hooks/use-toast";

export function DatabaseManagement() {
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyDatabase = async () => {
    setIsLoading(true);
    try {
      const isReady = await isDatabaseReady();
      toast({
        title: isReady ? "Database Ready" : "Database Needs Setup",
        description: isReady 
          ? "All required tables exist in the database." 
          : "Some tables may be missing. Try running the setup.",
        variant: isReady ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Database verification error:", error);
      toast({
        title: "Verification Failed",
        description: "Could not verify database status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupDatabase = async () => {
    setIsLoading(true);
    try {
      const result = await setupExamTables();
      if (result) {
        toast({
          title: "Database Setup Complete",
          description: "All required tables have been created successfully.",
        });
      } else {
        toast({
          title: "Database Setup Issues",
          description: "Some tables could not be created. Check console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Database setup error:", error);
      toast({
        title: "Setup Failed",
        description: "An error occurred during database setup.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Management</CardTitle>
        <CardDescription>
          Manage your database structure and verify tables
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground mb-4">
          Use these tools to verify and set up your database structure.
        </p>
        
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <Button
            variant="outline"
            onClick={handleVerifyDatabase}
            disabled={isLoading}
          >
            Verify Database Structure
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleSetupDatabase}
            disabled={isLoading}
          >
            Setup Missing Tables
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

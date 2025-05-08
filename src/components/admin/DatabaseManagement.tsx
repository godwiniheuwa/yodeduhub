
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { clearDatabaseData } from "@/services/supabase/setupTables";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function DatabaseManagement() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClearDatabase = async () => {
    try {
      setIsLoading(true);
      toast({
        title: "Database Cleanup Started",
        description: "Removing all data from database tables...",
      });

      const result = await clearDatabaseData();
      
      if (result) {
        toast({
          title: "Database Cleanup Complete",
          description: "All data has been successfully removed from the database.",
        });
      } else {
        toast({
          title: "Database Cleanup Failed",
          description: "There was an error clearing the database. Check console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during database cleanup:", error);
      toast({
        title: "Database Cleanup Failed",
        description: "An unexpected error occurred. Check console for details.",
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
          Manage your database data and structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Use these tools carefully. Clearing the database will permanently remove all data.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isLoading}>
              {isLoading ? "Clearing..." : "Clear All Data"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all data from your database tables. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearDatabase}>
                Yes, clear all data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}


import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { addYear } from "@/services/supabase/years";

interface AddYearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onYearAdded: (year: any) => void;
  years: any[];
}

export function AddYearDialog({
  open,
  onOpenChange,
  onYearAdded,
  years,
}: AddYearDialogProps) {
  const [yearValue, setYearValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYearValue(e.target.value);
    setError("");
  };

  const validateYear = () => {
    const yearNum = parseInt(yearValue, 10);
    
    if (isNaN(yearNum)) {
      setError("Please enter a valid year");
      return false;
    }
    
    if (yearNum < 1900 || yearNum > 2100) {
      setError("Year must be between 1900 and 2100");
      return false;
    }
    
    const exists = years.some(year => year.year === yearNum);
    if (exists) {
      setError("This year already exists");
      return false;
    }
    
    return true;
  };

  const handleSaveYear = async () => {
    if (!validateYear()) return;
    
    try {
      setIsSubmitting(true);
      const yearNum = parseInt(yearValue, 10);
      
      console.log('Adding year:', yearNum);
      const newYear = await addYear(yearNum);
      console.log('Year added:', newYear);
      
      toast({
        title: "Year added",
        description: `Year ${yearNum} has been added successfully`,
      });
      
      setYearValue("");
      onYearAdded(newYear);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding year:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add year",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Exam Year</DialogTitle>
          <DialogDescription>
            Add a new year for which exams are available.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right">
              Year
            </Label>
            <Input
              id="year"
              type="number"
              placeholder="2023"
              className="col-span-3"
              value={yearValue}
              onChange={handleYearChange}
              min="1900"
              max="2100"
            />
          </div>
          
          {error && (
            <div className="text-destructive text-sm px-4">
              {error}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveYear}
            disabled={!yearValue || isSubmitting}
            className="bg-quiz-primary hover:bg-purple-700"
          >
            {isSubmitting ? "Adding..." : "Add Year"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

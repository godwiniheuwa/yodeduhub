
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addYear } from '@/services/supabase/exam';

interface AddYearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onYearAdded: (year: any) => void;
  years: any[];
}

export function AddYearDialog({ open, onOpenChange, onYearAdded, years }: AddYearDialogProps) {
  const [yearValue, setYearValue] = useState(new Date().getFullYear().toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveYear = async () => {
    if (!yearValue || !/^\d{4}$/.test(yearValue)) {
      toast({
        title: "Error",
        description: "Please enter a valid 4-digit year",
        variant: "destructive",
      });
      return;
    }

    // Check if year already exists
    if (years.some(y => y.year === parseInt(yearValue))) {
      toast({
        title: "Error",
        description: "This year already exists in the system",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Add new year
      const newYear = await addYear(parseInt(yearValue));
      
      if (newYear) {
        onYearAdded(newYear);
        
        toast({
          title: "Year added",
          description: `Year ${yearValue} has been added successfully`,
        });
        
        onOpenChange(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add year",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Exam Year</DialogTitle>
          <DialogDescription>
            Enter a year for which you want to add examination papers
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input 
              id="year" 
              type="number"
              min="1990"
              max="2050"
              value={yearValue} 
              onChange={(e) => setYearValue(e.target.value)} 
              placeholder="e.g. 2024"
              disabled={isSaving}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveYear}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

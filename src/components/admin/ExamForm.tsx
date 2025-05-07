
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { getYears } from "@/services/supabase/exam";

type ExamFormProps = {
  onSubmit: (examData: any) => void;
  isLoading?: boolean;
  initialData?: any;
};

export function ExamForm({ onSubmit, isLoading = false, initialData }: ExamFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [abbreviation, setAbbreviation] = useState(initialData?.abbreviation || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [yearId, setYearId] = useState(initialData?.year_id || "");
  const [years, setYears] = useState<any[]>([]);
  const [errors, setErrors] = useState<{
    title?: string;
    abbreviation?: string;
    yearId?: string;
  }>({});
  
  useEffect(() => {
    // Fetch years for the dropdown
    const fetchYears = async () => {
      try {
        const yearsData = await getYears();
        setYears(yearsData);
        
        // If no year is selected and we have years, select the first one
        if (!yearId && yearsData.length > 0) {
          setYearId(yearsData[0].id);
        }
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };
    
    fetchYears();
  }, [yearId]);
  
  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      abbreviation?: string;
      yearId?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = "Exam title is required";
    }
    
    if (!abbreviation.trim()) {
      newErrors.abbreviation = "Abbreviation is required";
    } else if (abbreviation.length > 10) {
      newErrors.abbreviation = "Abbreviation must be 10 characters or less";
    }
    
    if (!yearId) {
      newErrors.yearId = "Please select a year";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const examData = {
        name: title,
        abbreviation,
        description,
        year_id: yearId,
        id: initialData?.id || undefined,
      };
      
      onSubmit(examData);
    } else {
      toast({
        title: "Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Exam" : "Create New Exam"}</CardTitle>
        <CardDescription>
          {initialData 
            ? "Update the details for this examination type." 
            : "Enter the details to create a new examination type."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Exam Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Joint Admissions and Matriculation Board"
              disabled={isLoading}
              aria-invalid={errors.title ? "true" : "false"}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="abbreviation">Abbreviation</Label>
            <Input
              id="abbreviation"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              placeholder="e.g. JAMB"
              maxLength={10}
              disabled={isLoading}
              aria-invalid={errors.abbreviation ? "true" : "false"}
            />
            {errors.abbreviation && <p className="text-sm text-destructive">{errors.abbreviation}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select 
              value={yearId} 
              onValueChange={setYearId}
              disabled={isLoading}
            >
              <SelectTrigger id="year" className={errors.yearId ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.yearId && <p className="text-sm text-destructive">{errors.yearId}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of this exam"
              className="resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => window.history.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-quiz-primary hover:bg-purple-700" 
            disabled={isLoading}
          >
            {isLoading 
              ? (initialData ? "Updating..." : "Creating...")
              : (initialData ? "Update Exam" : "Create Exam")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

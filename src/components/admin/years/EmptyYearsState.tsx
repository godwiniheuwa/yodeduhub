
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface EmptyYearsStateProps {
  onAddYear: () => void;
}

export function EmptyYearsState({ onAddYear }: EmptyYearsStateProps) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500 mb-4">No exam years available yet</p>
      <Button onClick={onAddYear}>
        <Plus className="mr-1 h-4 w-4" /> Add Your First Year
      </Button>
    </div>
  );
}

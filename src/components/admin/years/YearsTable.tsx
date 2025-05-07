
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from 'lucide-react';

interface YearsTableProps {
  years: any[];
  onDeleteYear: (id: string) => void;
}

export function YearsTable({ years, onDeleteYear }: YearsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Year</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {years.map((year) => (
          <TableRow key={year.id}>
            <TableCell className="font-medium">{year.year}</TableCell>
            <TableCell className="text-right">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-500 hover:text-red-700" 
                onClick={() => onDeleteYear(year.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

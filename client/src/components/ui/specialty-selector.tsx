import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Specialty } from "@shared/schema";

interface SpecialtySelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function SpecialtySelector({
  value,
  onChange,
  placeholder = "Select a specialty",
  required = false
}: SpecialtySelectorProps) {
  const { data: specialties = [], isLoading } = useQuery({
    queryKey: ["/api/specialties"],
    queryFn: async () => {
      const response = await fetch("/api/specialties");
      if (!response.ok) throw new Error("Failed to fetch specialties");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Medical Specialty</Label>
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="specialty" className="text-base font-medium">
        Medical Specialty {required && "*"}
      </Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {specialties.map((specialty: Specialty) => (
            <SelectItem key={specialty.id} value={specialty.id}>
              {specialty.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

import { Instructor } from "@/types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';


export const InstructorSelector = ({
    instructors,
    assignedInstructors,
    onSelect
  }: {
    instructors: Instructor[],
    assignedInstructors: Instructor[],
    onSelect: (value: string) => void
  }) => {
    const availableInstructors = instructors.filter(
      instructor => !assignedInstructors.some(i => i.id === instructor.id)
    );
  
    return (
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Seleccionar..." />
        </SelectTrigger>
        <SelectContent>
          {availableInstructors.map(instructor => (
            <SelectItem key={instructor.id} value={instructor.id}>
              {instructor.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };
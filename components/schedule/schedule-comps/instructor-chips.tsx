import { Instructor } from "@/types";

// Componentes pequeños
export const InstructorChip = ({ 
  instructor, 
  onRemove 
}: { 
  instructor: Instructor, 
  onRemove: () => void 
}) => (
  <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
    <span>{instructor.name}</span>
    <button
      type="button"
      onClick={onRemove}
      className="ml-2 text-red-500 hover:text-red-700"
    >
      ×
    </button>
  </div>
);
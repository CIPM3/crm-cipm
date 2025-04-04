"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerDemoProps {
  value: Date | null;
  onChange: (date: Date) => void;
  onBlur?: () => void;
}

export function DatePickerDemo({ value, onChange, onBlur }: DatePickerDemoProps) {
  const isValidDate = value instanceof Date && !isNaN(value.getTime());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !isValidDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="size-5 mr-2" />
          {isValidDate ? format(value!, "MM/dd/yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={(date) => {
            if (date) {
              onChange(date);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

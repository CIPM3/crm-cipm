"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerDemoProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    onBlur: () => void; // Cambiar el tipo de onBlur
}

export function DatePickerDemo({ value, onChange, onBlur }: DatePickerDemoProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start items-center border-input text-gray-500 border text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="size-5 mr-2" />
                    {value ? format(value, "MM/dd/yyyy") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={value || undefined}
                    onSelect={(date) => {
                        onChange(date || null);
                        onBlur(); // Llamar a onBlur sin argumentos
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
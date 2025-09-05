import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
}

// Predefined time slots
const TIME_SLOTS = [
  { value: "09:00", label: "9:00 AM" },
  { value: "09:30", label: "9:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "13:30", label: "1:30 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "14:30", label: "2:30 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "15:30", label: "3:30 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "16:30", label: "4:30 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "17:30", label: "5:30 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "18:30", label: "6:30 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "19:30", label: "7:30 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "20:30", label: "8:30 PM" },
  { value: "21:00", label: "9:00 PM" },
];

export function DateTimePicker({ date, onDateChange, placeholder = "Pick a date & time" }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [timeValue, setTimeValue] = React.useState(
    date ? format(date, "HH:mm") : "09:00"
  );
  const [timeMode, setTimeMode] = React.useState<"preset" | "manual">("preset");

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Preserve the time when date changes
      const [hours, minutes] = timeValue.split(":");
      selectedDate.setHours(parseInt(hours), parseInt(minutes));
      onDateChange(selectedDate);
    } else {
      onDateChange(undefined);
    }
  };

  const handleTimeChange = (time: string) => {
    setTimeValue(time);
    if (date && time) {
      const [hours, minutes] = time.split(":");
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours), parseInt(minutes));
      onDateChange(newDate);
    }
  };

  const handlePresetTimeSelect = (time: string) => {
    handleTimeChange(time);
  };

  const handleDateTimeSet = () => {
    if (date) {
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-bold border-border/50 hover:border-primary transition-bounce hover:scale-105 bg-card/50 backdrop-blur-sm shadow-aggressive hover:shadow-hover-aggressive",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-5 w-5" />
          {date ? (
            <span className="flex items-center gap-3 font-semibold">
              <span>{format(date, "PPP")}</span>
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-primary">{format(date, "HH:mm")}</span>
            </span>
          ) : (
            <span className="font-medium tracking-wide">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-border/50 bg-card/95 backdrop-blur-md shadow-aggressive" align="start">
        <div className="p-4 space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            className="pointer-events-auto font-semibold"
          />
          <div className="border-t border-border/50 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold tracking-wide text-primary">⚡ TIME SELECTION</Label>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant={timeMode === "preset" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeMode("preset")}
                  className="h-7 px-3 text-xs font-bold transition-bounce hover:scale-105"
                >
                  PRESETS
                </Button>
                <Button
                  type="button"
                  variant={timeMode === "manual" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeMode("manual")}
                  className="h-7 px-3 text-xs font-bold transition-bounce hover:scale-105"
                >
                  MANUAL
                </Button>
              </div>
            </div>

            {timeMode === "preset" ? (
              <div className="space-y-3">
                <Select value={timeValue} onValueChange={handlePresetTimeSelect}>
                  <SelectTrigger className="w-full border-border/50 bg-input/50 font-semibold hover:border-primary transition-smooth">
                    <Clock className="h-4 w-4 text-primary mr-2" />
                    <SelectValue placeholder="SELECT TIME SLOT" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-card/95 backdrop-blur-md border-border/50">
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value} className="font-semibold hover:bg-primary/10">
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.slice(0, 12).map((slot) => (
                    <Button
                      key={slot.value}
                      type="button"
                      variant={timeValue === slot.value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handlePresetTimeSelect(slot.value)}
                      className="h-9 text-xs font-bold transition-bounce hover:scale-105"
                    >
                      {slot.label}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <Input
                  type="time"
                  value={timeValue}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="flex-1 border-border/50 bg-input/50 font-bold text-lg hover:border-primary transition-smooth"
                  step="300" // 5-minute intervals
                />
              </div>
            )}
          </div>
          {date && (
            <Button
              onClick={handleDateTimeSet}
              className="w-full bg-gradient-primary hover:scale-105 transition-bounce shadow-aggressive hover:shadow-hover-aggressive font-bold text-lg tracking-wide"
              size="lg"
            >
              ⚡ LOCK IN TIME ⚡
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
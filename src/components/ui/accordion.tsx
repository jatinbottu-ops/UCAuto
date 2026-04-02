"use client";

import { useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: "single" | "multiple";
}

const AccordionContext = createContext<AccordionContextType>({
  openItems: [],
  toggleItem: () => {},
  type: "single",
});

interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}

function Accordion({ type = "single", collapsible = true, defaultValue, className, children }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultValue ? [defaultValue] : []);

  const toggleItem = (value: string) => {
    if (type === "single") {
      setOpenItems((prev) => {
        if (prev.includes(value)) {
          return collapsible ? [] : prev;
        }
        return [value];
      });
    } else {
      setOpenItems((prev) =>
        prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div data-slot="accordion" className={cn("flex w-full flex-col", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemContextType {
  value: string;
  isOpen: boolean;
}
const AccordionItemContext = createContext<AccordionItemContextType>({ value: "", isOpen: false });

interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function AccordionItem({ value, className, children }: AccordionItemProps) {
  const { openItems } = useContext(AccordionContext);
  const isOpen = openItems.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div data-slot="accordion-item" className={cn("border-b", className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

function AccordionTrigger({ className, children }: AccordionTriggerProps) {
  const { toggleItem } = useContext(AccordionContext);
  const { value, isOpen } = useContext(AccordionItemContext);

  return (
    <div className="flex">
      <button
        data-slot="accordion-trigger"
        onClick={() => toggleItem(value)}
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-left text-sm font-medium transition-all hover:underline",
          className
        )}
        aria-expanded={isOpen}
      >
        {children}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ml-2",
            isOpen && "rotate-180"
          )}
        />
      </button>
    </div>
  );
}

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

function AccordionContent({ className, children }: AccordionContentProps) {
  const { isOpen } = useContext(AccordionItemContext);

  if (!isOpen) return null;

  return (
    <div
      data-slot="accordion-content"
      className={cn("overflow-hidden text-sm", className)}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

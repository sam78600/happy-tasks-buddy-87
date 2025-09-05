import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName: string;
  itemType?: string;
}

export function DeleteConfirmDialog({ 
  isOpen, 
  onOpenChange, 
  onConfirm, 
  itemName, 
  itemType = "item" 
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border/50 bg-card/95 backdrop-blur-md shadow-aggressive font-rajdhani">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-xl font-orbitron font-black tracking-wide">
            <Trash2 className="h-6 w-6 text-destructive animate-pulse-glow" />
            🗲 TERMINATE {itemType.toUpperCase()}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left text-lg font-medium text-muted-foreground leading-relaxed">
            Are you absolutely certain you want to <span className="text-destructive font-bold">PERMANENTLY DELETE</span> this {itemType}?
            <br />
            <span className="text-primary font-bold text-xl">"{itemName}"</span>
            <br />
            <span className="text-destructive font-bold">⚠ THIS ACTION IS IRREVERSIBLE ⚠</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-4">
          <AlertDialogCancel className="border-border/50 hover:bg-muted/50 transition-bounce hover:scale-105 font-bold tracking-wide">
            ABORT MISSION
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-gradient-danger text-white hover:scale-110 transition-bounce shadow-aggressive hover:shadow-hover-aggressive font-bold tracking-wider"
          >
            🗲 DESTROY {itemType.toUpperCase()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
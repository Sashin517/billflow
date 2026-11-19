"use client";

import { useState } from "react";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function BusinessThemeForm() {
  const [hexColor, setHexColor] = useState("#3E00F");
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      console.log("File dropped:", files[0].name);
    }
  };

  const handleSave = () => {
    console.log("Saving theme settings...");
  };

  return (
    <div className="bg-card border border-border rounded-xl p-8 max-w-5xl">
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-foreground">Business Theme</h3>
        
        <div className="space-y-6">
          <h4 className="text-base font-medium text-muted-foreground">Brand Identity</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Logo Upload Section */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                Company Logo
              </label>
              
              <div 
                className={`
                  border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 transition-colors h-full
                  ${isDragging ? "border-primary bg-primary/5" : "border-border bg-input/50"}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary/50 mb-4">
                  <CloudUpload className="w-6 h-6 text-primary" />
                </div>
                <div className="text-sm text-foreground mb-1 text-center">
                  Drag & Drop or <span className="text-primary cursor-pointer hover:underline">Browse</span>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  MAX 5 MB, PNG/JPG
                </div>
              </div>
            </div>

            {/* Letter Head Color Section */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                Letter Head Color (Optional)
              </label>
              <div className="relative">
                 <div className="flex h-9.5 w-full overflow-hidden rounded-md border border-input bg-input focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
                    <div className="flex shrink-0 items-center justify-center px-3 border-r border-input">
                      <div 
                        className="w-5 h-5 rounded-sm shadow-inner" 
                        style={{ backgroundColor: hexColor.length === 7 ? hexColor : '#E0A753' }} // Fallback to primary gold if invalid
                      />
                    </div>
                    <input 
                      type="text" 
                      value={hexColor}
                      onChange={(e) => setHexColor(e.target.value)}
                      className="h-full w-full bg-transparent px-3 text-sm outline-none text-muted-foreground uppercase"
                      placeholder="#E0A753" 
                    />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <Separator className="bg-border" />
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" className="px-8 bg-transparent hover:bg-secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} className="px-8 bg-primary hover:bg-primary-hover text-primary-foreground">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
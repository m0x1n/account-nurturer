import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ChecklistItemCard } from "./ChecklistItemCard";
import { useChecklistItems } from "./useChecklistItems";

const SetupChecklist = () => {
  const [progress, setProgress] = useState(0);
  const checklistItems = useChecklistItems();

  useEffect(() => {
    const completedItems = checklistItems.filter(item => item.completed).length;
    const totalProgress = (completedItems / checklistItems.length) * 100;
    setProgress(totalProgress);
  }, [checklistItems]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Setup Checklist</h1>
        <p className="text-muted-foreground">
          Complete these steps to get your business ready for appointments
        </p>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {checklistItems.filter(item => item.completed).length} of {checklistItems.length} tasks completed
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {checklistItems.map((item) => (
          <ChecklistItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default SetupChecklist;
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AUTOMATION_TYPES, getAutomationTypeLabel, type AutomationTypeId } from "@/constants/automationTypes";
import { useConnectAutomation } from "../hooks/useConnectAutomation";
import AutomationTypeSelector from "./AutomationTypeSelector";
import ConnectAutomationDialog from "./ConnectAutomationDialog";

type AutomationRecommendationProps = {
  planStepId: string;
};

export default function AutomationRecommendation({ planStepId }: AutomationRecommendationProps) {
  const [selectedType, setSelectedType] = useState<AutomationTypeId>(AUTOMATION_TYPES[0].id);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const connectAutomation = useConnectAutomation();

  if (connectAutomation.isSuccess) {
    return <p className="mt-3 text-xs text-primary">자동화가 연결됐어요.</p>;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
      <AutomationTypeSelector value={selectedType} onChange={setSelectedType} />
      <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
        자동화 연결
      </Button>
      <ConnectAutomationDialog
        open={isDialogOpen}
        automationTypeLabel={getAutomationTypeLabel(selectedType)}
        onConfirm={() => {
          connectAutomation.mutate({ planStepId, type: selectedType });
          setDialogOpen(false);
        }}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}

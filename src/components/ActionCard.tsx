import { QuickActionType } from "@/constants";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

function ActionCard({ action, onClick }: { action: QuickActionType; onClick: () => void }) {
  return (
    <Card
      className="group relative overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      {/* ACTION GRADIENT */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-100 group-hover:opacity-50 transition-opacity", action.gradient)} />

      {/* ACTION CONTENT WRAPPER */}
      <div className="relative p-6 size-full">
        <div className="space-y-3">
          {/* ACTION ICON */}
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform",
              {
                "bg-primary/10": action.color === "primary",
                "bg-orange-500/10": action.color === "orange-500",
                "bg-blue-500/10": action.color === "blue-500",
                "bg-purple-500/10": action.color === "purple-500",
              }
            )}
          >
            <action.icon
              className={cn("h-6 w-6", {
                "text-primary": action.color === "primary",
                "text-orange-500": action.color === "orange-500",
                "text-blue-500": action.color === "blue-500",
                "text-purple-500": action.color === "purple-500",
              })}
            />
          </div>

          {/* ACTION DETAILS */}
          <div className="space-y-1">
            <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-muted-foreground">{action.description}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ActionCard;

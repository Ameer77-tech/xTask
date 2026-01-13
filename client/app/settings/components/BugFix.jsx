import { Star } from "lucide-react";

const bugFixes = [
  "Fixed delete account error caused by by url mismatch",
  "Resolved dashboard data filtering bug showing inconsistent results",
];

const BugFixes = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <ul className="space-y-2 text-sm text-muted-foreground">
        {bugFixes.map((fix, index) => (
          <li key={index} className="flex items-start gap-2">
            <Star className="h-4 w-4 mt-0.5 text-primary/70 shrink-0" />
            <span>{fix}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BugFixes;

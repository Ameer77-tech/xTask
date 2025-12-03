import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import DeleteBtn from "./DeleteBtn";
import Logout from "./Logout";
import Export from "./Export";

const Privacy = () => {
  return (
    <section className="w-full px-8 py-10 flex justify-center">
      <Card className="w-full max-w-6xl bg-secondary/40 border border-border/50 shadow-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-semibold">Privacy</CardTitle>
        </CardHeader>

        <CardContent className="space-y-10 px-8">
          <div className="pt-6 border-t border-border/50">
            <p className="text-lg font-medium text-foreground mb-3">
              Export Your Data
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Download all your tasks and projects as a local backup file.
            </p>
           <Export />
          </div>

          <div className="pt-6 border-t border-border/50">
            <p className="text-lg font-medium text-destructive mb-3">
              Delete Account
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Permanently delete your data from this device. This action cannot
              be undone.
            </p>
            <div className="flex gap-5">
              <DeleteBtn />
              <Logout />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Privacy;

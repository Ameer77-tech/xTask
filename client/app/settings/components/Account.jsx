import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pencil } from "lucide-react";

const Account = ({ user }) => {
  return (
    <section className="lg:w-full lg:px-6 py-8 flex justify-center">
      <Card className="w-full max-w-6xl bg-secondary/40 border border-border/50 shadow-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-4xl font-semibold">Account</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8 px-6 sm:px-10">
          {/* Avatar + Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative self-center sm:self-start">
              <Image
                src={"/pro.png"}
                alt="User avatar"
                width={90}
                height={90}
                className="rounded-full border border-border/60 object-cover"
              />
              <button
                className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-1.5 rounded-full hover:bg-primary/90 transition"
                title="Change avatar"
              >
                <Pencil size={14} />
              </button>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-base font-medium text-foreground">
                {user.displayName}
              </p>
              <p className="text-sm text-muted-foreground">
                @{user.email || user.userName}
              </p>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Display Name
            </label>
            <Input
              value={user.displayName}
              disabled
              className="bg-background"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Username
            </label>
            <Input
              value={user.userName || user.email}
              disabled
              className="bg-background opacity-80"
            />
          </div>

          {/* Email Section */}
          {user.email ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                value={user.email.includes("@") ? user.email : "-"}
                disabled
                className="bg-background opacity-80"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                No email added for updates or recovery.
              </p>
              <Button variant="outline" className="w-fit sm:w-auto">
                Add Email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default Account;

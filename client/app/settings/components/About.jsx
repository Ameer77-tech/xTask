import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import SendFeedBackInput from "./SendFeedBackInput";

const app = {
  name: "xTask",
  version: "1.0.0",
  description:
    "xTask is a lightweight, privacy-focused task manager designed for personal productivity. Manage tasks, track priorities, and customize your experience effortlessly.",
  github: "https://github.com/yourusername/xtask",
  linkedin: "https://linkedin.com/in/yourprofile",
};

const About = () => {
  return (
    <section className="w-full px-8 py-10 flex justify-center">
      <Card className="w-full max-w-6xl bg-secondary/40 border border-border/50 shadow-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-semibold">About</CardTitle>
        </CardHeader>

        <CardContent className="px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              {app.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Version {app.version}
            </p>
            <p className="max-w-2xl mx-auto text-base text-muted-foreground pt-2">
              {app.description}
            </p>
          </div>

          <div className="flex justify-center gap-6 pt-2">
            <Link
              href={"https://github.com/Ameer77-tech"}
              target="_blank"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </Link>
            <Link
              href={"https://www.linkedin.com/in/ameer-shaik-55b106364/"}
              target="_blank"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm font-medium">LinkedIn</span>
            </Link>
          </div>
          <SendFeedBackInput />
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground pt-6">
          © {new Date().getFullYear()} {app.name}. All rights reserved.
        </CardFooter>
      </Card>
    </section>
  );
};

export default About;

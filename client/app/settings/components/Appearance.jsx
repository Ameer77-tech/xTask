"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const Appearance = () => {
  const [settings, setSettings] = useState({
    theme: "dark",
  });
  useEffect(() => {
    setSettings({
      theme: localStorage.getItem("theme") || "dark",
    });
  }, []);

  useEffect(() => {
    const html = document.documentElement;

    if (settings.theme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.add("light");
      html.classList.remove("dark");
    }

    localStorage.setItem("theme", settings.theme);
  }, [settings.theme]);

  return (
    <section className="w-full px-8 py-10 flex justify-center">
      <Card className="w-full max-w-6xl bg-secondary/40 border border-border/50 shadow-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-semibold">Appearance</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8 px-8">
          <div className="space-y-3">
            <Label className="text-lg  font-medium text-foreground">
              Theme
            </Label>

            <Select
              value={settings.theme}
              onValueChange={(value) => setSettings({ theme: value })}
            >
              <SelectTrigger className=" w-full">
                <SelectValue placeholder="Select Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Appearance;

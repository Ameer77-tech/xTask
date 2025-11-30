import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

const MobileBtn = ({ setIsOpen }) => {
  return (
    <div className="md:hidden fixed bottom-5 right-5 z-100">
      <Button onClick={() => setIsOpen(true)} size={"lg"} className={"rounded-full w-12 h-12"}>
        <Plus />
      </Button>
    </div>
  );
};

export default MobileBtn;

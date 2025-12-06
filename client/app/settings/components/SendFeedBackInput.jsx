"use client";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import SendFeedBack from "./SendFeedBack";

const SendFeedBackInput = () => {
  const [message, setMessage] = useState("");
  return (
    <div className="space-y-3 pt-6">
      <label
        htmlFor="feedback"
        className="text-base font-medium text-foreground"
      >
        Request a Feature or Report a Bug
      </label>
      <Textarea
        onChange={(e) => setMessage(e.target.value)}
        id="feedback"
        placeholder="Describe your suggestion or issue..."
        className="min-h-[100px] mt-3 resize-none"
      />
      <div className="flex justify-end pt-2">
        <SendFeedBack message={message} setMessage={setMessage}/>
      </div>
    </div>
  );
};

export default SendFeedBackInput;

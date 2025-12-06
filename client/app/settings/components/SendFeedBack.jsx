"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const SendFeedBack = ({ message, setMessage }) => {
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    setDisable(message === "");
  }, [message]);

  const send = async () => {
    setDisable(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_XTASK_FRONTEND}/api/feedback`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ message: message }),
          credentials: "include",
        }
      );
      const res = await response.json();
      if (!res.success) {
        alert(res.reply);
        setDisable(true);
        return;
      } else {
        alert(res.reply);
        setDisable(true);
        setMessage("");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Button disabled={disable} onClick={send} className="px-6 text-base">
        Send Feedback
      </Button>
    </>
  );
};

export default SendFeedBack;

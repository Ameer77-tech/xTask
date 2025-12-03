"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Dialog from "./Dialog";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();
  const apiurl = `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/auth/logout-user`;
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiurl, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      });
      const res = await response.json();
      if (res.success) {
        router.replace("login");
      } else {
        alert(res.reply);
      }
    } catch (err) {
      console.log(err);
      alert("Error");
    } finally {
      setIsOpen(false);
    }
  };
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="This Will Log You Out Of Your Account"
        variant="primary"
        children={
          <>
            {loading ? (
              <Button variant={"destructive"} disabled={loading}>
                .........
              </Button>
            ) : (
              <Button
                variant={"destructive"}
                disabled={loading}
                onClick={() => handleLogout()}
              >
                Confirm Logout
              </Button>
            )}
          </>
        }
      />
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        disabled={loading}
        className="px-6 border-destructive hover:bg-destructive hover:text-white"
      >
        Logout
      </Button>
    </>
  );
};

export default Logout;

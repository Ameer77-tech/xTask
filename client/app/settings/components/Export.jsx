"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Dialog from "./Dialog";
import * as XLSX from "xlsx";

const Export = () => {
  const [isOpen, setIsOpen] = useState(false);
  const apiurl = `${process.env.NEXT_PUBLIC_XTASK_BACKEND}/api/export`;
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiurl, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      const tasks = json.data.tasks || [];
      const projects = json.data.projects || [];

      const tasksSheet = XLSX.utils.json_to_sheet(tasks);
      const projectsSheet = XLSX.utils.json_to_sheet(projects);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, tasksSheet, "Tasks");
      XLSX.utils.book_append_sheet(workbook, projectsSheet, "Projects");

      XLSX.writeFile(workbook, "exported-data.xlsx");
    } catch (err) {
      console.error(err);
      alert("Error exporting data");
    } finally {
      setIsOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Export Data Locally"
        variant="primary"
        children={
          <>
            {loading ? (
              <Button disabled={loading}>.........</Button>
            ) : (
              <Button disabled={loading} onClick={() => handleExport()}>
                Export
              </Button>
            )}
          </>
        }
      />
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="px-6"
      >
        Export Data
      </Button>
    </>
  );
};

export default Export;

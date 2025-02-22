import TableHead from "@/components/atoms/TableHead";
import React from "react";



const TableHeaders = ({ activeTab }:{activeTab:string}) => {
  switch (activeTab) {
    case "Branches":
      return <TableHead headers={["Name"]} />;
    case "Departments":
      return <TableHead headers={["Name", "Code",  "Department HOD"]} />;
    case "Categories":
      return <TableHead headers={["Name", "Actions"]} />;
    default:
      return null;
  }
};

export default TableHeaders;
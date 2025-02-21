import TableHead from "@/components/atoms/TableHead";
import React from "react";



const TableHeaders = ({ activeTab }:{activeTab:string}) => {
  switch (activeTab) {
    case "Branches":
      return <TableHead headers={["Name",  "Status", "Actions"]} />;
    case "Departments":
      return <TableHead headers={["Name", "Code",  "Department HOD", "Status", "Actions"]} />;
    case "Categories":
      return <TableHead headers={["Name", "Status", "Actions"]} />;
    default:
      return null;
  }
};

export default TableHeaders;
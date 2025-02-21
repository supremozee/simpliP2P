import React from "react";
import CreateBranch from "../CreateBranch";
import CreateDepartment from "../CreateDepartment";
import CreateCategory from "../CreateCategory";


const CreateComponent: React.FC<{activeTab:string}> = ({ activeTab }) => {
  switch (activeTab) {
    case "Branches":
      return <CreateBranch />;
    case "Departments":
      return <CreateDepartment />;
    case "Categories":
      return <CreateCategory />;
    default:
      return null;
  }
};

export default CreateComponent;
import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
// !BASE URL
import { baseURL } from "../../utils/baseURL";

import axios from "axios";

const JobHelper = ({ users }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(users);

  console.log(users);

  const [columns, setColumns] = useState([
    { title: "First Name", field: "user.firstname" },
    { title: "Middle Name", field: "user.middlename" },
    { title: "Last name", field: "user.lastname" },
    { title: "Gender", field: "user.sex" },
    { title: "Course", field: "user.course.courseName" },
  ]);

  return (
    <div style={{ padding: "50px 40px", backgroundColor: "#ebe9e9" }}>
      <MaterialTable
        isLoading={isLoading}
        title="Applied Users"
        columns={columns}
        data={data}
        options={{
          exportButton: true,
          filtering: true,
          pageSize: 7,
          toolbar: true,
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
      />
    </div>
  );
};

export default JobHelper;

import React, { useState } from "react";

// Import matarial table
import MaterialTable from "material-table";

const CourseHelper = ({ graduates, courseName }) => {
  const [columns, setColumns] = useState([
    { title: "Name", field: "name" },
    {
      title: "Middle Name",
      field: "middleName",
      //   initialEditValue: "initial edit value",
    },
    { title: "Last Name", field: "lastName" },
    {
      title: "Batch",
      field: "batch",
      filtering: false,
    },
  ]);

  const [data, setData] = useState(graduates);

  return (
    <div style={{ padding: "40px" }}>
      <MaterialTable
        title={`Graduated in ${courseName}`}
        columns={columns}
        data={data}
        options={{
          exportButton: true,
          filtering: true,
          pageSize: 6,
          toolbar: true,
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
        // editable={{
        //   onRowAdd: (newData) =>
        //     new Promise((resolve, reject) => {
        //       setTimeout(() => {
        //         setData([...data, newData]);
        //         resolve();
        //       }, 1000);
        //     }),
        //   onRowUpdate: (newData, oldData) =>
        //     new Promise((resolve, reject) => {
        //       setTimeout(() => {
        //         const dataUpdate = [...data];
        //         const index = oldData.tableData.id;
        //         dataUpdate[index] = newData;
        //         setData([...dataUpdate]);

        //         resolve();
        //       }, 1000);
        //     }),
        //   onRowDelete: (oldData) =>
        //     new Promise((resolve, reject) => {
        //       setTimeout(() => {
        //         const dataDelete = [...data];
        //         const index = oldData.tableData.id;
        //         dataDelete.splice(index, 1);
        //         setData([...dataDelete]);

        //         resolve();
        //       }, 1000);
        //     }),
        // }}
      />
    </div>
  );
};

export default CourseHelper;

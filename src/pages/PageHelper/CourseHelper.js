import React, { useState } from "react";

// Import matarial table
import MaterialTable from "material-table";

const CourseHelper = ({ graduates, courseName }) => {
  // Calcualte Age
  const calculateAge = (date) => {
    const today = new Date();
    const birthDate = new Date(date); // create a date object directly from dob1 argument
    let age_now = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    return age_now;
  };

  const withAge = graduates.map((graduate) => {
    return {
      ...graduate,
      age: calculateAge(graduate.dateOfBirth),
    };
  });

  const [columns, setColumns] = useState([
    {
      title: "First Name",
      field: "firstname",
    },
    {
      title: "Middle Name",
      field: "middlename",
    },
    {
      title: "Last Name",
      field: "lastname",
    },
    {
      title: "Contact Number",
      field: "phone",
    },
    {
      title: "Gender",
      field: "sex",
    },
    {
      title: "Age",
      field: "age",
    },
    {
      title: "Birth Date",
      field: "dateOfBirth",
      type: "date",
      editable: false,
      dateSetting: {
        format: "dd/MM/yyyy",
      },
    },
    {
      title: "Batch",
      field: "yearGraduated",
    },
    {
      title: "Present Occupation",
      field: "presentOccupation",
      filtering: false,
    },
  ]);

  const [data, setData] = useState(withAge);

  console.log(graduates);

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

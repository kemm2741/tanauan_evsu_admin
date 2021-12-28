import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";

// !BASE URL
import { baseURL } from "../../utils/baseURL";
import calculateAge from "../../utils/calculateAge";

const EventsHelper = ({ rowdata }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(
      rowdata.users.map(({ user }) => {
        return {
          ...user,
          age: calculateAge(user.dateOfBirth),
        };
      })
    );
  }, [rowdata]);

  useEffect(() => {
    setData(
      rowdata.users.map(({ user }) => {
        return {
          ...user,
          age: calculateAge(user.dateOfBirth),
        };
      })
    );
  }, []);

  const [columns, setColumns] = useState([
    { title: "First Name", field: "firstname" },
    { title: "Middle Name", field: "middlename" },
    { title: "Last name", field: "lastname" },
    { title: "Age", field: "age" },
    { title: "Address", field: "address" },
    { title: "Gender", field: "sex" },
    { title: "Email Address", field: "email" },
    { title: "Contact", field: "phone" },
    { title: "Course", field: "course.courseName" },
    { title: "Year Graduated", field: "yearGraduated" },
  ]);

  return (
    <div style={{ padding: "50px 40px", backgroundColor: "#ebe9e9" }}>
      <MaterialTable
        title={`Alumnis Attending ${rowdata.eventTitle}`}
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
      {/* {JSON.stringify(withAge)} */}
    </div>
  );
};

export default EventsHelper;

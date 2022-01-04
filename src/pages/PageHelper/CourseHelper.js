import React, { useState, useCallback, useEffect } from "react";

// Import matarial table
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Users ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

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
  const [dataAlumni, setDataAlumni] = useState(withAge);

  // Statistics
  const maleLength = dataAlumni.filter(
    (user) => user.sex.toLowerCase() === "male"
  );
  const femaleLength = dataAlumni.filter(
    (user) => user.sex.toLowerCase() === "female"
  );

  // Working and Not Working Data
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  useEffect(() => {
    setData([
      { name: "Male", value: maleLength.length },
      { name: "Female", value: femaleLength.length },
    ]);
  }, [dataAlumni]);

  return (
    <div style={{ padding: "50px 40px", backgroundColor: "#ebe9e9" }}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8} lg={8} item align="center">
          <MaterialTable
            title={`Graduated in ${courseName}`}
            columns={columns}
            data={dataAlumni}
            options={{
              exportButton: true,
              filtering: true,
              pageSize: 6,
              toolbar: true,
              actionsColumnIndex: -1,
              addRowPosition: "first",
            }}
          />
        </Grid>

        <Grid xs={12} md={8} lg={4} item justify="center" align="center">
          <PieChart width={400} height={400}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx={200}
              cy={200}
              innerRadius={65}
              outerRadius={80}
              fill="#710000"
              dataKey="value"
              onMouseEnter={onPieEnter}
            />
          </PieChart>
        </Grid>
      </Grid>
    </div>
  );
};

export default CourseHelper;

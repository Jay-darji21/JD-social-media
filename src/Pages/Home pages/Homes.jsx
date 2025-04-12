import { Grid } from "@mui/material";
import React from "react";
import Sidebar from "../../Components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import MiddlePart from "../../Components/MiddlePart/MiddlePart.jsx";


const Homes = () => {
  const location = useLocation();
  return (
    <div>
      <div className="px-20">
        <Grid container spacing={0}>
          <Grid item xs={0} lg={3}>
            <div className="sticky top-0">
              <Sidebar />
            </div>
          </Grid>

          <Grid
            lg={location.pathname == "/" ? 6 : 9}
            item
            className="px-5 flex justify-center"
            xs={12}
          >

            <Routes>
              <Route path="/" element={MiddlePart}/>

            </Routes>
          </Grid>
        </Grid>

      </div>
    </div>
  );
};

export default Homes;

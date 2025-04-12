import { Card, Grid } from "@mui/material";
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

const Authentication = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/auth" || location.pathname === "/auth/signin";

  return (
    <div>
      <Grid container>
        <Grid className="h-screen overflow-hidden" item xs={7}>
          <img
            className="h-full w-full object-cover"
            src="https://cdn.pixabay.com/photo/2018/11/29/21/51/social-media-3846597_1280.png"
            alt=""
          />
        </Grid>

        <Grid item xs={5}>
          <div className="px-20 flex flex-col justify-center h-full">
            <Card className="card p-8">
              <div className="flex flex-col items-center mb-5 space-y-1">
                <h1 className="app-logo text-center">JD Socials</h1>
                <p className="text-center text-sm w-[70%]">
                  Connecting lives, Sharing stories: Your Social world, Your Way
                </p>
              </div>

              <Routes>
                <Route path="/" element={<Login setLoading={setLoading} />} />
                <Route path="/signin" element={<Login setLoading={setLoading} />} />
                <Route path="/signup" element={<Register setLoading={setLoading} />} />
              </Routes>

              <div className="mt-4 text-center">
                {isLogin ? (
                  <p>
                    Don't have an account?{" "}
                    <span
                      onClick={() => navigate("/auth/signup")}
                      className="text-blue-500 cursor-pointer hover:underline"
                    >
                      Register here
                    </span>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <span
                      onClick={() => navigate("/auth/signin")}
                      className="text-blue-500 cursor-pointer hover:underline"
                    >
                      Login here
                    </span>
                  </p>
                )}
              </div>
            </Card>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Authentication;

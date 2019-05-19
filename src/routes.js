import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, SimpleLayout } from "./layouts";

// Route Views
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";

export default [
  {
    path: "/login",
    layout: SimpleLayout,
    component: Login
  },
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/dashboard" />
  },
  {
    path: "/dashboard",
    layout: DefaultLayout,
    component: Dashboard
  },
  {
    path: "/add-new-post",
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite
  }
];

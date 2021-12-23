import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./authContext";
import authReducer from "./authReducer";

// Set Auth Token
import setAuthToken from "../../utils/setAuthToken";

// Base URL
import { baseURL } from "../../utils/baseURL";

import {
  // Admin
  LOGIN_ADMIN_REQUEST,
  LOGIN_ADMIN_SUCCESS,
  LOGIN_ADMIN_FAIL,
  LOAD_ADMIN_REQUEST,
  LOAD_ADMIN_SUCCESS,
  LOAD_ADMIN_FAIL,
  // USER
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  // LOGOUT
  LOG_OUT,
} from "../constant";

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticatedLogin: false,
    admin: null,
    errorLogin: null,
    isLoading: false,
  };
  const [state, dispatch] = useReducer(authReducer, initialState);
  // Load User
  const loadAdmin = async () => {
    setAuthToken(localStorage.token);
    try {
      dispatch({
        type: LOAD_ADMIN_REQUEST,
      });

      const { data } = await axios.get(`${baseURL}/loginadmin`);

      dispatch({
        type: LOAD_ADMIN_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({ type: LOAD_ADMIN_FAIL });
    }
  };

  const loginAdmin = async (loginData) => {
    try {
      dispatch({
        type: LOGIN_ADMIN_REQUEST,
      });
      const { data } = await axios.post(`${baseURL}/loginadmin`, {
        email: loginData.email,
        password: loginData.password,
      });
      dispatch({
        type: LOGIN_ADMIN_SUCCESS,
        payload: data,
      });
      loadAdmin();
    } catch (error) {
      dispatch({
        type: LOGIN_ADMIN_FAIL,
        payload: error.response.data.msg,
      });
    }
  };

  // Logout
  const logout = () => dispatch({ type: LOG_OUT });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticatedLogin: state.isAuthenticatedLogin,
        isLoading: state.isLoading,
        admin: state.admin,
        errorLogin: state.errorLogin,
        loadAdmin,
        loginAdmin,
        // loadUser,
        // loginUser,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;

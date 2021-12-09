// Import Axios
import axios from "axios";

// Base API URL
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

export default (state, action) => {
  switch (action.type) {
    case LOGIN_ADMIN_REQUEST:
    case LOAD_ADMIN_REQUEST:
    case LOGIN_USER_REQUEST:
    case LOAD_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_USER_SUCCESS:
    case LOGIN_ADMIN_SUCCESS:
      axios
        .post(`${baseURL}/log`, {
          name: action.payload.admin.userName,
          logDescription: "Log-in",
        })
        .then((res) => {
          // ? Succes Submiting to log activity, ayaw na ig console log HAHAA
          // console.log(res);
        })
        .catch((err) => console.log(err));
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isLoading: false,
        admin: action.payload.admin,
        isAuthenticatedLogin: true,
        token: action.payload.token,
        errorLogin: null,
      };
    case LOGIN_USER_FAIL:
    case LOGIN_ADMIN_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        isLoading: false,
        token: null,
        isAuthenticatedLogin: false,
        admin: null,
        errorLogin: action.payload,
      };
    case LOAD_ADMIN_FAIL:
    case LOAD_USER_FAIL:
      return {
        ...state,
        isLoading: false,
        token: null,
        isAuthenticatedLogin: false,
        admin: null,
        errorLogin: null,
      };
    case LOAD_ADMIN_SUCCESS:
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        isAuthenticatedLogin: true,
        isLoading: false,
        admin: action.payload,
        errorLogin: null,
      };
    case LOG_OUT:
      localStorage.removeItem("token");
      return {
        token: null,
        isAuthenticatedLogin: false,
        admin: null,
        errorLogin: null,
        isLoading: false,
      };
    default:
      return state;
  }
};

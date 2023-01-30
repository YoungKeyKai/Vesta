import axios from 'axios';
import { createContext, useContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';

const HANDLERS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REFRESH: 'REFRESH',
};

const defaultContext = {
  isAuthenticated: false,
  accessToken: null,
  userId: null,
};

const handlers = {
  [HANDLERS.LOGIN]: (state, action) => {
    const accessToken = action.payload;
    const {user_id: userId} = jwtDecode(accessToken)

    return {
      ...state,
      isAuthenticated: true,
      accessToken,
      userId,
    };
  },
  [HANDLERS.LOGOUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      accessToken: null,
      userId: null,
    };
  },
  [HANDLERS.REFRESH]: (state, action) => {
    if (!state.isAuthenticated) {
      console.error("Trying to refresh when not logged in.")
      return state
    }

    const accessToken = action.payload;

    return {
      ...state,
      accessToken,
    };
  },
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext(defaultContext);

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, defaultContext);

  const login = (accessToken) => {
    dispatch({
      type: HANDLERS.LOGIN,
      payload: accessToken,
    });
  };

  const logout = () => {
    dispatch({
      type: HANDLERS.LOGOUT,
    });
  };

  const refresh = (accessToken) => {
    dispatch({
      type: HANDLERS.REFRESH,
      payload: accessToken,
    })
  }

  const authAxios = axios.create({
    headers: {
      'Authorization': `Bearer ${state.accessToken}` 
    }
  });
  authAxios.interceptors.response.use(
    response => response,
    async error => {
      if (error.response.status == 401 && error.response.data?.code == 'token_not_valid') {
        return axios.post('/api/auth/token/refresh/', {}, {withCredentials: true})
          .then((response) => {
            refresh(response.data.access)

            error.config.headers.Authorization = `Bearer ${response.data.access}`
            return authAxios(error.config);
          })
          .catch(() => logout())
      }

      return Promise.reject(error)
    }
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        authAxios,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);

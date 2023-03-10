import axios from 'axios';
import { createContext, useContext, useReducer, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { useUserContext } from './user-context';

const IS_AUTH_SESSION_STORAGE_NAME = 'vesta-is-auth'

const HANDLERS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REFRESH: 'REFRESH',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
};

const defaultContext = {
  isAuthenticated: false,
  accessToken: null,
  userId: null,
  isLoading: true,
};

const handlers = {
  [HANDLERS.SET_AUTHENTICATED]: (state) => {
    return {
      ...state,
      isAuthenticated: true,
      isLoading: false
    }
  },
  [HANDLERS.LOGIN]: (state, action) => {
    const accessToken = action.payload;
    const {user_id: userId} = jwtDecode(accessToken)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(IS_AUTH_SESSION_STORAGE_NAME, "true");
    }

    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      accessToken,
      userId,
    };
  },
  [HANDLERS.LOGOUT]: (state) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(IS_AUTH_SESSION_STORAGE_NAME);
    }

    return {
      ...state,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      userId: null,
    };
  },
  [HANDLERS.REFRESH]: (state, action) => {
    const accessToken = action.payload;
    const {user_id: userId} = jwtDecode(accessToken)
    return {
      ...state,
      accessToken,
      userId,
      isLoading: false,
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
  const {setUser} = useUserContext();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = sessionStorage.getItem(IS_AUTH_SESSION_STORAGE_NAME);
      if (storedAuth === "true") {
        if (!state.accessToken) {
          axios.post('/api/auth/token/refresh/')
            .then((response) => {
              const {user_id: userId} = jwtDecode(response.data.access)
              setAuthenticated();
              refresh(response.data.access)
              axios
                .get(`/api/userinfo/${userId}/`, {
                  headers: {'Authorization': `Bearer ${response.data.access}`}
                })
                .then((response) => setUser(response.data))
                .catch(console.error)
            })
            .catch(() => logout())
        } else {
          setAuthenticated();
        }
      }
      else {
        authAxios.get('/api/auth/token/remove/').catch()
        logout()
      }
    }
  }, []);

  const setAuthenticated = () => {
    dispatch({
      type: HANDLERS.SET_AUTHENTICATED,
    });
  }

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

  const authAxios = axios.create();
  authAxios.interceptors.request.use(
    config => {
      config.headers['Authorization'] = `Bearer ${state.accessToken}`
      return config
    }
  )
  authAxios.interceptors.response.use(
    response => response,
    async error => {
      if (error.response.status == 401 && error.response.data?.code == 'token_not_valid') {
        return axios.post('/api/auth/token/refresh/')
          .then((response) => {
            refresh(response.data.access)

            // Use normal axios for the retry to avoid infinite loops
            error.config.headers.Authorization = `Bearer ${response.data.access}`
            return axios(error.config);
          })
          .catch((error) => {
            logout()
            return Promise.reject(error)
          })
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

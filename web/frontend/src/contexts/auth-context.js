import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const HANDLERS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
};

const defaultContext = {
  isAuthenticated: false,
  accessToken: null,
};

const handlers = {
  [HANDLERS.LOGIN]: (state, action) => {
    const accessToken = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      accessToken,
    };
  },
  [HANDLERS.LOGOUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      accessToken: null,
    };
  }
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
      payload: accessToken
    });
  };

  const logout = () => {
    dispatch({
      type: HANDLERS.LOGOUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout
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

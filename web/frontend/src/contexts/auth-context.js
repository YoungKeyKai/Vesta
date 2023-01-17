import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const HANDLERS = {
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const defaultContext = {
  isAuthenticated: false,
  accessToken: null,
};

const handlers = {
  [HANDLERS.SIGN_IN]: (state, action) => {
    const accessToken = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      accessToken,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
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

  const signIn = (accessToken) => {
    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: accessToken
    });
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut
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

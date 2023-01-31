import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const HANDLERS = {
  SET_USER: 'SET_USER',
  REMOVE_USER: 'REMOVE_USER',
};

const defaultContext = {
  userId: null,
  name: null,
  email: null,
};

const handlers = {
  [HANDLERS.SET_USER]: (state, action) => {
    const {userId, name, email} = action.payload;
    return {
      ...state,
      userId,
      name,
      email,
    };
  },
  [HANDLERS.REMOVE_USER]: () => {
    return defaultContext;
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const UserContext = createContext(defaultContext);

export const UserProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, defaultContext);

  const setUser = (userInfo) => {
    dispatch({
      type: HANDLERS.SET_USER,
      payload: userInfo
    });
  };

  const removeUser = () => {
    dispatch({
      type: HANDLERS.REMOVE_USER
    });
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        setUser,
        removeUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node
};

export const UserConsumer = UserContext.Consumer;

export const useUserContext = () => useContext(UserContext);

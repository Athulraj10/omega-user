import * as types from '../actions/types';

export interface RegistrationState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: RegistrationState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
};

const registrationReducer = (state = initialState, action: any): RegistrationState => {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload,
        loading: false,
        error: null,
      };

    case types.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        error: null,
      };

    case types.SET_USER_DATA:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

export default registrationReducer; 
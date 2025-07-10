import * as types from '../actions/types';

interface ThemeState {
  theme: string;
  mode: "light" | "dark";
  direction: "LTR" | "RTL";
}

const getInitialState = (): ThemeState => {
  if (typeof window !== "undefined") {
    return {
      theme: localStorage.getItem("theme") || "color-primary",
      mode: (localStorage.getItem("mode") as "light" | "dark") || "light",
      direction: (localStorage.getItem("direction") as "LTR" | "RTL") || "LTR",
    };
  }
  return { theme: "color-primary", mode: "light", direction: "LTR" };
};

const themeReducer = (state = getInitialState(), action: any): ThemeState => {
  switch (action.type) {
    case types.SET_THEME:
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
      }
      return {
        ...state,
        theme: action.payload,
      };

    case types.SET_DIRECTION:
      if (typeof window !== "undefined") {
        localStorage.setItem("direction", action.payload);
      }
      return {
        ...state,
        direction: action.payload,
      };

    case types.TOGGLE_MODE:
      const newMode = state.mode === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("mode", newMode);
      }
      return {
        ...state,
        mode: newMode,
      };

    default:
      return state;
  }
};

export default themeReducer; 
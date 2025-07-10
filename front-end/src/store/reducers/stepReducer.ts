import * as types from '../actions/types';

export interface StepState {
  steps: boolean[];
}

const initialState: StepState = {
  steps: [true, true, true, false, false],
};

const stepReducer = (state = initialState, action: any): StepState => {
  switch (action.type) {
    case types.MARK_STEP_AS_DONE:
      return {
        ...state,
        steps: state.steps.map((step, index) =>
          index === action.payload ? true : step
        ),
      };

    default:
      return state;
  }
};

export default stepReducer; 
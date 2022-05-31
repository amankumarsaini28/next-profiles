import { useCallback, useReducer } from "react";

enum FormActionTypes {
  SET_VALUE,
  SET_FORM_VALUE,
}

const formReducer = (state, action) => {
  switch (action.type) {
    case FormActionTypes.SET_VALUE:
      return {
        ...state,
        value: {
          ...state.value,
          [action.payload.key]: action.payload.value,
        },
      };
    case FormActionTypes.SET_FORM_VALUE:
      return {
        ...state,
        value: {
          ...state.value,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

const initalFormValue = {
  value: {},
};

export const useForm = () => {
  const [state, dispatch] = useReducer(formReducer, initalFormValue);

  const onChange = useCallback(
    (event) => {
      dispatch({
        type: FormActionTypes.SET_VALUE,
        payload: {
          key: event.target.id,
          value: event.target.value,
        },
      });
    },
    [state]
  );

  const setFormValue = useCallback(
    (value) => {
      dispatch({
        type: FormActionTypes.SET_FORM_VALUE,
        payload: value,
      });
    },
    [state]
  );

  return { state, onChange, setFormValue };
};

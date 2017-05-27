import {SET_SETTINGS} from '../actions/actions';

export type settingsStateType = {
  path: string,
};

export type actionType = {
  type: string,
};

export const settingsInitialState = {
  path: '',
  formsPath: '',
}

export default function settings(state: settingsStateType = settingsInitialState, action: actionType) {
  switch (action.type) {
    case SET_SETTINGS:
      return {...action.settings}
    default:
      return state;
  }
}

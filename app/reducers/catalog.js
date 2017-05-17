// TODO: bring back the flow.
import update from 'immutability-helper';
import {ADD_ORIGINAL, ADD_THUMBNAIL, ADD_ENTRY} from '../actions/actions';

const initialState = {
  'OU.ADUL.F.1.1998': {
    'p051': {
      original: 'OU.ADUL.F.1.1998_p051.jpg',
      thumbnail: 'OU.ADUL.F.1.1998_p051_thumbnail.jpg',
      entries: [
        'bla_2932323.json',
        'blbu_296611.json',
      ]
    }
  }
}

function updatePage(catalog, action, props) {
  return {
    ...catalog,
    [action.book]: {
      ...catalog[action.book],
      [action.page]: {
        ...catalog[action.book][action.page],
        ...props
      }
    }
  }
}

export default function catalog(state = initialState, action) {
  switch (action.type) {
    case ADD_ORIGINAL:
      return updatePage(state, action, {original: action.fileName})
    default:
      return state;
  }
}

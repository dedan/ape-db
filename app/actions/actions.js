const storage = require('electron-json-storage');

export const SET_SETTINGS = 'SET_SETTINGS'

export function setSettings(settings) {
  storage.set('settings', settings, function(error) {
    if (error) throw error;
  });

  return {
    type: SET_SETTINGS,
    settings
  }
}

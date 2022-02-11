import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the uploadFiles state domain
 */

const selectUploadFilesDomain = state => state.uploadFiles || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by UploadFiles
 */

const makeSelectUploadFiles = () =>
  createSelector(
    selectUploadFilesDomain,
    substate => substate,
  );

export default makeSelectUploadFiles;
export { selectUploadFilesDomain };

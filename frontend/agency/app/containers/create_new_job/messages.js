/*
 * CreateNewJob Messages
 *
 * This contains all the text for the CreateNewJob container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CreateNewJob';

export default defineMessages({
  createNew: {
    id: `${scope}.createNew`,
    defaultMessage: 'Create New Job',
  },
  edit: {
    id: `${scope}.edit`,
    defaultMessage: 'Edit',
  },
  create: {
    id: `${scope}.create`,
    defaultMessage: 'Create New',
  },
  create: {
    id: `${scope}.create`,
    defaultMessage: 'Create New',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  jobInfo: {
    id: `${scope}.jobInfo`,
    defaultMessage: 'Job Info',
  },
  jobType: {
    id: `${scope}.jobType`,
    defaultMessage: 'Job Type',
  },
  createJobSuccess: {
    id: `${scope}.createJobSuccess`,
    defaultMessage: 'New job created successfully',
  },
  createJobError: {
    id: `${scope}.createJobError`,
    defaultMessage: 'Job type error',
  },
  editJobSuccess: {
    id: `${scope}.editJobSuccess`,
    defaultMessage: 'Job edited successfully',
  },
});

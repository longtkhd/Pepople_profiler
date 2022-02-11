/*
 * CreateNewJobDetail Messages
 *
 * This contains all the text for the CreateNewJobDetail container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CreateNewJobDetail';

export default defineMessages({
  createNew: {
    id: `${scope}.createNew`,
    defaultMessage: 'Create New Job',
  },
  businessName: {
    id: `${scope}.businessName`,
    defaultMessage: 'Business Name',
  },
  client: {
    id: `${scope}.client`,
    defaultMessage: 'Client',
  },
  email: {
    id: `${scope}.email`,
    defaultMessage: 'Email',
  },
  contactNumber: {
    id: `${scope}.contactNumber`,
    defaultMessage: 'Contact Number',
  },
  jobTitle: {
    id: `${scope}.jobTitle`,
    defaultMessage: 'Position Being Recruited',
  },
  jobType: {
    id: `${scope}.jobType`,
    defaultMessage: 'Job Type',
  },
  candidates: {
    id: `${scope}.candidates`,
    defaultMessage: 'Add shortlisted candidates resumes',
  },
  drag: {
    id: `${scope}.drag`,
    defaultMessage: 'Drag & drop resumes or',
  },
  upload: {
    id: `${scope}.upload`,
    defaultMessage: 'Upload from computer',
  },
  edit: {
    id: `${scope}.edit`,
    defaultMessage: 'Edit',
  },
  delete: {
    id: `${scope}.delete`,
    defaultMessage: 'Delete',
  },
  addCandidate: {
    id: `${scope}.addCandidate`,
    defaultMessage: 'Add existing candidate',
  },
  addCandidates: {
    id: `${scope}.addCandidates`,
    defaultMessage: 'Add existing candidates',
  },
  letGo: {
    id: `${scope}.letGo`,
    defaultMessage: "Let's go",
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  add: {
    id: `${scope}.add`,
    defaultMessage: 'Add',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Save',
  },
  tryAgain: {
    id: `${scope}.tryAgain`,
    defaultMessage: 'Try Again',
  },
  next: {
    id: `${scope}.next`,
    defaultMessage: 'Next',
  },
  missingContent: {
    id: `${scope}.missingContent`,
    defaultMessage: 'Content incorrect or missing? Unfortunately, parsing CV’s is not always perfect. Simply edit these fields on the next screen.'
  },

});

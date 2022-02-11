/*
 * CandidateReportNavigate Messages
 *
 * This contains all the text for the CandidateReportForm container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CandidateReportNavigate';

export default defineMessages({
  activeJobList: {
    id: `${scope}.activeJobList`,
    defaultMessage: 'Active Job List',
  },
  addCandidateToAnotherJob: {
    id: `${scope}.recruiterAssessment`,
    defaultMessage: 'Add candidate to another job',
  },
  candidateAandR: {
    id: `${scope}.candidateAandR`,
    defaultMessage: 'Candidate Assessment & Reports',
  },
  spellCheck: {
    id: `${scope}.spellCheck`,
    defaultMessage: 'Spell Check',
  },
  preview: {
    id: `${scope}.preview`,
    defaultMessage: 'Preview',
  },
  exportToPdf: {
    id: `${scope}.exportToPdf`,
    defaultMessage: 'Export To PDF',
  },
  addCandidateSuccessfully: {
    id: `${scope}.addCandidateSuccessfully`,
    defaultMessage: 'Linkedln RecommendationsAdd candidate to job successfully',
  },
  noCandidateSelected: {
    id: `${scope}.noCandidateSelected`,
    defaultMessage: 'No candidate has been selected yet',
  },
  done: {
    id: `${scope}.done`,
    defaultMessage: 'Done',
  },
  exportConfirmTitle: {
    id: `${scope}.exportConfirmTitle`,
    defaultMessage: 'Spell Check',
  },
  exportConfirmMessage: {
    id: `${scope}.exportConfirmMessage`,
    defaultMessage: ' Have you performed a spell check on this document, before exporting to PDF?',
  },
  buttonYes: {
    id: `${scope}.exportConfirmMessage`,
    defaultMessage: 'Yes',
  }
});

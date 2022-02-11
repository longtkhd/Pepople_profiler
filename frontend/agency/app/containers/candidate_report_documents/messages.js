/*
 * CandidateReportDocuments Messages
 *
 * This contains all the text for the CandidateReportDocuments container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.CandidateReportDocuments';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the CandidateReportDocuments container!',
  },
  uploadSuccess: {
    id: `${scope}.uploadSuccess`,
    defaultMessage: 'Upload document success!',
  },
  shareSuccess: {
    id: `${scope}.shareSuccess`,
    defaultMessage: 'Share document success!',
  },
  removeSuccess: {
    id: `${scope}.removeSuccess`,
    defaultMessage: 'Removed document success!',
  },
  errorShare: {
    id: `${scope}.errorShare`,
    defaultMessage: 'Share document faild!',
  },
  errorUpload: {
    id: `${scope}.errorUpload`,
    defaultMessage: 'Upload document faild!',
  },
  errorRemove: {
    id: `${scope}.errorRemove`,
    defaultMessage: 'Remove document faild!',
  },
  errorDownload: {
    id: `${scope}.errorDownload`,
    defaultMessage: 'Download document faild!',
  },
  buttonSave: {
    id: `${scope}.buttonSave`,
    defaultMessage: 'Save',
  },
  buttonUpload: {
    id: `${scope}.buttonSave`,
    defaultMessage: 'Upload Document',
  },
  titleForm: {
    id: `${scope}.titleForm`,
    defaultMessage: 'Document',
  },
  titleModal: {
    id: `${scope}.titleModal`,
    defaultMessage: 'Upload Documents',
  },
  columnShare: {
    id: `${scope}.columnShare`,
    defaultMessage: ' ',
  },
  columnDocumentName: {
    id: `${scope}.columnDocumentName`,
    defaultMessage: 'DOCUMENT NAME',
  },
  columnUploadDate: {
    id: `${scope}.columnUploadDate`,
    defaultMessage: 'UPLOADED DATE',
  },
  columnActions: {
    id: `${scope}.columnActions`,
    defaultMessage: 'ACTIONS',
  },
  notiShare: {
    id: `${scope}.notiShare`,
    defaultMessage: 'Select and save the documents to share with your client.'
  },
  buttonModalUpload: {
    id: `${scope}.buttonModalUpload`,
    defaultMessage: 'Upload'
  },
  dropText: {
    id: `${scope}.dropText`,
    defaultMessage: 'Drag & drop your files here'
  },
  modalButtonSelect: {
    id: `${scope}.modalButtonSelect`,
    defaultMessage: ' Select from computer'
  },
  modalOrText: {
    id: `${scope}.modalOrText`,
    defaultMessage: 'or'
  },
  confirmRemoveTitle: {
    id: `${scope}.confirmRemoveTitle`,
    defaultMessage: 'Are you sure?'
  },
  confirmRemoveMessage: {
    id: `${scope}.confirmRemoveMessage`,
    defaultMessage: 'Are you sure you want to delete this document?'
  },
  buttonRemove: {
    id: `${scope}.buttonRemove`,
    defaultMessage: 'Remove'
  },
});

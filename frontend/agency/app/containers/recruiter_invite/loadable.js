/**
 *
 * Asynchronously loads the component for RecruiterInvite
 *
 */
import React from 'react';
import loadable from 'utils/loadable';
import SpinnerPage from 'components/SpinnerPage';

export default loadable(() => import('./index'), {
  fallback: <SpinnerPage />
});

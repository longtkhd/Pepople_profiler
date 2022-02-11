/**
 *
 * Asynchronously loads the component for RecruiterJob
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

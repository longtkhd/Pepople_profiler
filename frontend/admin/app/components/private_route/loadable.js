/**
 *
 * Asynchronously loads the component for Private Route
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

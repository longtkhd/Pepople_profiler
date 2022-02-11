/**
 *
 * Asynchronously loads the component for Container
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

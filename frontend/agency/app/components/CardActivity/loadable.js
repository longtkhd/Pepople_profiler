/**
 *
 * Asynchronously loads the component for CardActivity
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

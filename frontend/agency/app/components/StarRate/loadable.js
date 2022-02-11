/**
 *
 * Asynchronously loads the component for StarRate
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

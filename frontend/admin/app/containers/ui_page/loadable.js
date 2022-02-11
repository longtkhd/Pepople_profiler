/**
 *
 * Asynchronously loads the component for UIpage
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

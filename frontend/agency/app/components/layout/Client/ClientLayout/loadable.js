/**
 *
 * Asynchronously loads the component for ClientLayout
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

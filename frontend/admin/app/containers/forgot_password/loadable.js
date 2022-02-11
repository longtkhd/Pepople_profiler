/**
 *
 * Asynchronously loads the component for FogotPassword
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

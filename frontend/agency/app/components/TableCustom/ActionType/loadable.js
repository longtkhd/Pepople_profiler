/**
 *
 * Asynchronously loads the component for ActionGroup
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

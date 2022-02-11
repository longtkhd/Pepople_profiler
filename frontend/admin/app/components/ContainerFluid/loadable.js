/**
 *
 * Asynchronously loads the component for ContainerFluid
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

/**
 *
 * Asynchronously loads the component for PieChart
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

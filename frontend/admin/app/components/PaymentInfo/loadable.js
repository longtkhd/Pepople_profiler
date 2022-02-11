/**
 *
 * Asynchronously loads the component for PaymentInfo
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

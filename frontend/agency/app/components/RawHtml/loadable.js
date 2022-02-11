/**
 *
 * Asynchronously loads the component for RawHtml
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));

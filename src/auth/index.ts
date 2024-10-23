import { initMSAL } from './client';
import { getAuth } from './request';

export default {
    init: initMSAL,
    get: getAuth
}
import { SetMetadata } from '@nestjs/common';
export const IGNORE_BASIC_AUTH_KEY = 'IgnoreBasicGuard';
export const IgnoreBasicGuard =  (value: boolean = true) => SetMetadata(IGNORE_BASIC_AUTH_KEY, value);
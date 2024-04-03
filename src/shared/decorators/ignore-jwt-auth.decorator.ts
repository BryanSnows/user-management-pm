import { SetMetadata } from '@nestjs/common';
export const IGNORE_JWT_GUARD_KEY = 'ignoreJwtGuard';
export const IgnoreJwtGuard = (value: boolean = true) => SetMetadata(IGNORE_JWT_GUARD_KEY, value);
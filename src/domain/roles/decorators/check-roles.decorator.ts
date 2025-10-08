import { SetMetadata } from '@nestjs/common'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const CheckRoles = (...roles: string[]) => SetMetadata('roles', roles)

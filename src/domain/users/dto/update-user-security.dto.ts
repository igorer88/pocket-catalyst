import { PartialType } from '@nestjs/swagger'

import { CreateUserSecurityDto } from './create-user-security.dto'

export class UpdateUserSecurityDto extends PartialType(CreateUserSecurityDto) {}

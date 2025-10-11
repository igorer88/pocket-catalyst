import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { instanceToPlain } from 'class-transformer'

import { UserSecurity } from './entities/user-security.entity'
import { UserSecurityRepository } from './repositories/user-security.repository'
import { UpdateUserSecurityDto } from './dto'

@Injectable()
export class UserSecurityService {
  private logger = new Logger(this.constructor.name)
  context = {
    class: this.constructor.name
  }

  constructor(
    private readonly userSecurityRepository: UserSecurityRepository
  ) {}

  async findUserSecurity(userId: string): Promise<Partial<UserSecurity>> {
    let security = await this.userSecurityRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user']
    })

    if (!security) {
      throw new NotFoundException(
        `User security settings not found for user ID '${userId}'`
      )
    }

    return instanceToPlain(security) as Partial<UserSecurity>
  }

  async updateUserSecurity(
    userId: string,
    updateUserSecurityDto: UpdateUserSecurityDto
  ): Promise<Partial<UserSecurity>> {
    let security = await this.userSecurityRepository.findOne({
      where: { user: { id: userId } }
    })

    if (!security) {
      throw new NotFoundException(
        `User security settings not found for user ID '${userId}'`
      )
    }

    const { pin, pinHint, ...otherFields } = updateUserSecurityDto

    // Assign other fields directly
    Object.assign(security, otherFields)

    // Handle PIN hashing
    if (pin !== undefined) {
      if (pin) {
        security.securityPinHash =
          await this.userSecurityRepository.hashPassword(pin)
      } else {
        // If empty string, clear the PIN
        security.securityPinHash = null
      }
    }

    // Handle PIN hint
    if (pinHint !== undefined) {
      security.pinHint = pinHint
    }

    const updatedSecurity = await this.userSecurityRepository.save(security)

    // We need to reload it to get the user relation for the getter
    const reloadedSecurity = await this.userSecurityRepository.findOne({
      where: { id: updatedSecurity.id },
      relations: ['user']
    })

    return instanceToPlain(reloadedSecurity) as Partial<UserSecurity>
  }
}

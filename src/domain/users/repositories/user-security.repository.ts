import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as crypto from 'crypto'
import { Repository } from 'typeorm'

import { UserSecurity } from '../entities/user-security.entity'

@Injectable()
export class UserSecurityRepository extends Repository<UserSecurity> {
  constructor(
    @InjectRepository(UserSecurity)
    private repository: Repository<UserSecurity>
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }

  public async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex')
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err)
        resolve(salt + ':' + derivedKey.toString('hex'))
      })
    })
  }
}

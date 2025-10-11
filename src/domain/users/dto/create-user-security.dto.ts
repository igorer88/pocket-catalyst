import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator'

export class CreateUserSecurityDto {
  @IsOptional()
  @IsEmail()
  recoveryEmail?: string

  @IsOptional()
  @IsPhoneNumber()
  phone?: string
}

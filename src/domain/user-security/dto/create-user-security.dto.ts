import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches
} from 'class-validator'

export class CreateUserSecurityDto {
  @IsOptional()
  @IsEmail()
  recoveryEmail?: string

  @IsOptional()
  @IsPhoneNumber()
  phone?: string

  @IsString()
  @IsOptional()
  pinHint?: string

  @IsOptional()
  @IsString()
  @Length(4, 4, { message: 'PIN must be exactly 4 digits' })
  @Matches(/^\d{4}$/, { message: 'PIN must contain only digits' })
  pin?: string
}

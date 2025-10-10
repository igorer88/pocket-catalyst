import { IsLocale, IsOptional, IsString, Length } from 'class-validator'

import type { DefaultProfileExtraSettings } from '@/config/settings'

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  @Length(1, 30)
  firstName?: string

  @IsOptional()
  @IsString()
  @Length(1, 30)
  lastName?: string

  @IsOptional()
  @IsLocale()
  locale?: string

  @IsOptional()
  @IsString()
  @Length(3, 3)
  displayCurrency?: string

  @IsOptional()
  extraSettings?: DefaultProfileExtraSettings
}

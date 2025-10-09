import { ArrayMaxSize, ArrayMinSize, IsArray, IsUUID } from 'class-validator'

export class SetRolesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsUUID('4', { each: true })
  roleIds: string[]
}

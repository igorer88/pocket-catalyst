import type { DefaultProfileExtraSettings } from '@/config/settings'
import type { Profile } from '@/domain/profiles/entities/profile.entity'

// Type for profile with deserialized extraSettings
export type ProfileWithDeserializedSettings = Omit<Profile, 'extraSettings'> & {
  extraSettings: DefaultProfileExtraSettings
}

// Type for profile update data (commonly used fields)
export type ProfileUpdateData = Partial<
  Pick<Profile, 'firstName' | 'lastName' | 'locale' | 'displayCurrency'>
> & {
  extraSettings?: DefaultProfileExtraSettings | string
}

// Type that can represent profile in both serialized and deserialized states
export type ProfileSerializable =
  | Profile // Serialized state (extraSettings as string)
  | ProfileWithDeserializedSettings // Deserialized state (extraSettings as object)

// Re-export for convenience
export type { DefaultProfileExtraSettings }

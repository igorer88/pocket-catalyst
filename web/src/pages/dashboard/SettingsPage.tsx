import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BellIcon,
  BuildingLibraryIcon,
  InformationCircleIcon,
  LockClosedIcon,
  PaintBrushIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import type { Selection } from '@heroui/react'
import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardHeader,
  Tooltip
} from '@heroui/react'

import {
  AppAppearanceSection,
  IntegrationsSection,
  NotificationSection,
  ProfileSection,
  RegionalSettingsSection,
  SecuritySection,
  SupportSection
} from '@/components/settings'
import { useAuthStore } from '@/stores/authStore'
import { useProfileStore } from '@/stores/profileStore'
import { useSecurityStore } from '@/stores/securityStore'

const iconContainerClasses =
  'mr-4 flex-shrink-0 rounded-lg bg-primary-100/50 p-2 self-start cursor-pointer'
const iconClasses = 'h-6 w-6 text-primary-600'

function SettingsPage(): React.JSX.Element {
  const { user } = useAuthStore()
  const { fetchProfile } = useProfileStore()
  const { fetchSecuritySettings } = useSecurityStore()
  const { t } = useTranslation()

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())

  // Centralized fetching to avoid re-renders in individual components
  useEffect(() => {
    if (user?.id) {
      void fetchProfile(String(user.id))
      void fetchSecuritySettings(String(user.id))
    }
  }, [user?.id, fetchProfile, fetchSecuritySettings])

  const profileItems = [
    {
      title: t('pages.settings.personalInformation'),
      subtitle: t('pages.settings.personalInformationDescription'),
      tooltipContent: t('pages.settings.personalInformationTooltip'),
      icon: <UserCircleIcon className={iconClasses} />,
      content: <ProfileSection user={user} />
    },
    {
      title: t('pages.settings.security'),
      subtitle: t('pages.settings.securityDescription'),
      tooltipContent: t('pages.settings.securityTooltip'),
      icon: <LockClosedIcon className={iconClasses} />,
      content: <SecuritySection user={user} />
    }
  ]

  const preferencesItems = [
    {
      title: t('pages.settings.regionalSettings'),
      subtitle: t('pages.settings.regionalSettingsDescription'),
      tooltipContent: t('pages.settings.regionalSettingsTooltip'),
      icon: <UserCircleIcon className={iconClasses} />,
      content: <RegionalSettingsSection user={user} />
    },
    {
      title: t('pages.settings.appAppearance'),
      subtitle: t('pages.settings.appAppearanceDescription'),
      tooltipContent: t('pages.settings.appAppearanceTooltip'),
      icon: <PaintBrushIcon className={iconClasses} />,
      content: <AppAppearanceSection user={user} />
    },
    {
      title: t('pages.settings.notifications'),
      subtitle: t('pages.settings.notificationsDescription'),
      tooltipContent: t('pages.settings.notificationsTooltip'),
      icon: <BellIcon className={iconClasses} />,
      content: <NotificationSection user={user} />
    }
  ]

  const integrationsItems = [
    {
      title: t('pages.settings.bankAccounts'),
      subtitle: t('pages.settings.bankAccountsDescription'),
      tooltipContent: t('pages.settings.bankAccountsTooltip'),
      icon: <BuildingLibraryIcon className={iconClasses} />,
      content: <IntegrationsSection user={user} />
    }
  ]

  const supportItems = [
    {
      title: t('pages.settings.about'),
      subtitle: t('pages.settings.aboutDescription'),
      tooltipContent: t('pages.settings.aboutTooltip'),
      icon: <InformationCircleIcon className={iconClasses} />,
      content: <SupportSection />
    }
  ]

  const renderAccordion = (items: typeof profileItems): React.JSX.Element => (
    <Accordion
      className="w-full"
      selectedKeys={selectedKeys}
      onSelectionChange={keys => setSelectedKeys(keys)}
    >
      {items.map(item => (
        <AccordionItem
          key={item.title}
          textValue={item.title}
          startContent={<div className={iconContainerClasses}>{item.icon}</div>}
          title={
            <div className="flex items-center cursor-pointer">
              <span className="font-semibold">{item.title}</span>
              <Tooltip content={item.tooltipContent}>
                <QuestionMarkCircleIcon className="ml-2 h-5 w-5 text-gray-400" />
              </Tooltip>
            </div>
          }
          subtitle={
            <span className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              {item.subtitle}
            </span>
          }
        >
          {item.content}
        </AccordionItem>
      ))}
    </Accordion>
  )

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold">{t('pages.settings.title')}</h1>
      </CardHeader>
      <CardBody>
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold">
              {t('pages.settings.profile')}
            </h2>
            {renderAccordion(profileItems)}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {t('pages.settings.preferences')}
            </h2>
            {renderAccordion(preferencesItems)}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {t('pages.settings.integrations')}
            </h2>
            {renderAccordion(integrationsItems)}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {t('pages.settings.support')}
            </h2>
            {renderAccordion(supportItems)}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default SettingsPage

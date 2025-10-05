import { useTranslation } from 'react-i18next'
import { Card, CardBody, CardHeader } from '@heroui/react'

function HomePage(): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold">{t('pages.home.title')}</h1>
      </CardHeader>
      <CardBody>
        <p>{t('pages.home.welcome')}</p>
        <p>{t('pages.home.summary')}</p>
      </CardBody>
    </Card>
  )
}

export default HomePage

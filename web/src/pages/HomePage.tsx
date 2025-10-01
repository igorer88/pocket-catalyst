import { FormattedMessage } from 'react-intl'
import { Card, CardBody, CardHeader } from '@heroui/react'

function HomePage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold">
          <FormattedMessage id="pages.home.title" />
        </h1>
      </CardHeader>
      <CardBody>
        <p>
          <FormattedMessage id="pages.home.welcome" />
        </p>
        <p>
          <FormattedMessage id="pages.home.summary" />
        </p>
      </CardBody>
    </Card>
  )
}

export default HomePage

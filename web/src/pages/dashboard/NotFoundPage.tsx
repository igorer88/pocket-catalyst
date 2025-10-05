import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const DashboardNotFoundPage = (): React.JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-6xl font-bold text-slate-700">
        {t('pages.notFound.title')}
      </h1>
      <p className="mt-4 text-xl text-slate-600">
        {t('pages.notFound.message')}
      </p>
      <Link
        to="/dashboard"
        className="mt-8 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
      >
        {t('pages.notFound.goHome')}
      </Link>
    </div>
  )
}

export default DashboardNotFoundPage

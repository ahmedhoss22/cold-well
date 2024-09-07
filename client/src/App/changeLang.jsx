import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

export const useLanguageRoute = () => {
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const pathSegments = location.pathname.split('/')
    const currentLang = pathSegments[1]

    if (currentLang === 'admin') {
      i18n.changeLanguage('en')
      return
    }

    if (!['en', 'ar'].includes(currentLang)) {
      const newPath = `/${i18n.language}${location.pathname}`
      navigate(newPath, { replace: true })
    } else if (currentLang !== i18n.language) {
      i18n.changeLanguage(currentLang)
    }

    const direction = currentLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('dir', direction)
    document.documentElement.setAttribute('lang', currentLang)
  }, [location.pathname, i18n, navigate])

  const changeLanguage = (newLang) => {
    const currentPathname = location.pathname
    const currentLang = currentPathname.split('/')[1]

    if (currentLang === newLang) return

    let newPathname
    if (['en', 'ar'].includes(currentLang)) {
      newPathname = currentPathname.replace(`/${currentLang}`, `/${newLang}`)
    } else {
      newPathname = `/${newLang}${currentPathname}`
    }

    navigate(newPathname)
  }

  return { changeLanguage }
}

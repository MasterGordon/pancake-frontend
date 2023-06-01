import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Menu as UikitMenu, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useTranslation, languageList } from '@pancakeswap/localization'
import PhishingWarningBanner from '../PhishingWarningBanner'
import { NetworkSwitcher } from '../NetworkSwitcher'
import useTheme from '../../hooks/useTheme'
import { useCakeBusdPrice } from '../../hooks/useBUSDPrice'
import UserMenu from './UserMenu'
import { useMenuItems } from './hooks/useMenuItems'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { footerLinks } from './config/footerConfig'
import { SettingsMode } from './GlobalSettings/types'

const Menu = (props) => {
  const { isDark, setTheme } = useTheme()
  const cakePriceUsd = useCakeBusdPrice({ forceMainnet: true })
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()
  // const [showPhishingWarningBanner] = usePhishingBannerManager()
  const showPhishingWarningBanner = false

  const menuItems = useMenuItems()

  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  const subLinks = useMemo(() => {
    if (activeSubMenuItem?.items?.length > 0) {
      return activeSubMenuItem.items
    }
    for (const menuItem of menuItems) {
      const parentSubLinks = menuItem.items?.find((item) => item.items?.includes(activeSubMenuItem))
      if (parentSubLinks) {
        return parentSubLinks.items
      }
    }

    return activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items
  }, [activeMenuItem?.hideSubNav, activeMenuItem?.items, activeSubMenuItem, menuItems])

  const linkComponent = useCallback((linkProps) => {
    return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
  }, [])

  const rightSide = useMemo(() => {
    return (
      <>
        <GlobalSettings mode={SettingsMode.GLOBAL} />
        <NetworkSwitcher />
        <UserMenu />
      </>
    )
  }, [])

  return (
    <>
      <UikitMenu
        linkComponent={linkComponent}
        rightSide={rightSide}
        banner={showPhishingWarningBanner && typeof window !== 'undefined' && <PhishingWarningBanner />}
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentLang={currentLanguage.code}
        langs={languageList}
        setLang={setLanguage}
        cakePriceUsd={cakePriceUsd}
        links={menuItems}
        subLinks={subLinks}
        footerLinks={getFooterLinks}
        activeItem={activeMenuItem?.href}
        activeSubItem={activeSubMenuItem?.href}
        buyCakeLabel={t('Buy ICE')}
        {...props}
      />
    </>
  )
}

export default Menu

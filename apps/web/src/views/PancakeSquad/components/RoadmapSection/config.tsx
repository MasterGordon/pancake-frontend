import { ContextApi } from '@pancakeswap/localization'

type FAQsType = {
  t: ContextApi['t']
}

const config = ({ t }: FAQsType) => [
  {
    icon: '🚀',
    title: t('Launch'),
    description: [
      'Launch of the Swap and liquidity provision functionality on Bitgert',
      'Multiple IceCream airdrops to the community',
      'Add Bitgert bridged tokens to the default token list',
      'Create an analytics page for the swap to show all pools, their liquidity, volume and much more',
    ],
    reached: '06-2022',
  },
  {
    title: t('Partnerships'),
    icon: '👨‍',
    description: [
      'Partner with and list Bitgert Projects',
      'AMA sessions to spread the word and inform users',
      'Work very close with the Bitgert blockchain team',
      'More IceCream Airdrops',
    ],
    reached: '07-2022',
  },
  {
    title: t('Multi Chain'),
    icon: '🌐',
    description: [
      'Add more chains to our Bridge (Doken and Fuse)',
      'More AirDrops',
      'Super reliable Bridge'
    ],
    reached: '10-2022',
  },
  {
    title: t('Expansion'),
    icon: '🚀',
    description: [
      'Partnerships with many big upcoming chains',
      'More AirDrops'
    ],
    reached: '11-2022',
  },
  {
    title: t('UI upgrades'),
    icon: '👨‍💻',
    description: [
      'Upgrade from Uniswap based UI to Pancakeswap based UI',
      'Upgrade from weekly AirDrops to continuouse liqudiity farming'
    ],
    reached: '12-2022',
  },
  {
    title: t('Bridge UI upgrade and smart routing'),
    icon: '👨‍💻',
    description: [
      'Integrate Bridge UI directly in the swap UI for a seamless experience',
      'Add smart routing capability\'s to drastically reduce price impact and greatly increase swap outputs'
    ],
    reached: '01-2023',
  },
  {
    title: t('CORE DAO expansion'),
    icon: '🚀',
    description: [
      'First Dex and Bridge on Core Dao mainnet',
      'add many new projects on Core Dao to default list',
      'created liquid staking CORE token StakedCore(SCORE) smart contracts'
    ],
    reached: '02-2023',
  },
  {
    title: t('Launchpad, KYC token and enhanced smart routing'),
    icon: '🌔',
    description: [
      'Release LaunchPad',
      'Release Soulbound KYC token to drastically reduce scams',
      'Provide optimized swaps on supported chains through accessing the entire liquidity on the chain'
    ],
    reached: '03-2023',
  },
  {
    title: t('Mass expansion'),
    icon: '🚀🚀',
    description: ['expand to a lot of blockchains and provide optimal dex routing on them thanks to our smart routing'],
    reached: '05-2023',
  },
]
export default config
import { Box, Button, Flex, Heading, PageHeader, Text } from '@pancakeswap/uikit'
import { isMobile } from 'react-device-detect'
import { useAccount, useSigner } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useSWR from 'swr'
import { useActiveChain } from 'hooks/useActiveChain'
import { useToken } from 'hooks/Tokens'
import { Contract, utils } from 'ethers'
import { ERC20_ABI } from 'config/abi/erc20'
import { ERC20 } from '@chainsafe/chainbridge-contracts'
import Link from 'next/link'
import { useTransactionAdder } from 'state/transactions/hooks'
import styled, { useTheme } from 'styled-components'
import kycAsset from './images/KYC.png'
import Page from 'components/Layout/Page'
import { tokens } from '@pancakeswap/ui'
import AddToWallet from 'views/CreateToken/components/AddToWallet'
import useTokenBalance from 'hooks/useTokenBalance'

const H1 = styled(Heading)`
  font-size: 32px;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 64px;
    margin-bottom: 24px;
  }
`
const H2 = styled(Heading)`
  font-size: 16px;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 24px;
    margin-bottom: 18px;
  }
`

const ImgWrapper = styled.div`
  display: none;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
    margin-left: 24px;
  }
`

export const Kyc: React.FC = () => {
  const chain = useActiveChain()
  const { address, status } = useAccount()
  const token = useToken(chain.kyc?.stableCoin)
  const addTransaction = useTransactionAdder()
  const paid = useSWR(
    address ? `kyc/${address}` : null,
    async () => {
      const response = await fetch(`api/kyc-info/${address}`)
      const data = await response.json()
      return data.status
    },
    { refreshInterval: 2000 },
  )
  const { data: signer } = useSigner()

  const handlePayment = async () => {
    if (!token) return
    if (!signer) return
    if (!chain.kyc) return
    const tokenContract = new Contract(token.address, ERC20_ABI, signer) as ERC20
    const tx = await tokenContract.transfer(
      chain.kyc?.feeWallet,
      utils.parseUnits(String(chain.kyc.fee), token.decimals),
    )
    addTransaction(tx, {
      summary: `Pay ${chain.kyc.fee} ${token.symbol} to get your KYC token`,
    })
  }
  const { isDark } = useTheme()
  const tokenBalance = useTokenBalance(chain.kyc.stableCoin)
  const canPay = Number(utils.formatEther(tokenBalance?.balance?.toString() ?? '0')) >= chain?.kyc?.fee

  let action: React.ReactNode | undefined

  if (status === 'connected' && paid.data) {
    if (paid.data === 'payed')
      action = (
        <Link href="https://icecreamswap.synaps.me" passHref legacyBehavior>
          <Button as="a" height="40px" width="100%">
            Proceed to KYC
          </Button>
        </Link>
      )
    else if (paid.data === 'verified')
      action = (
        <Flex alignItems="center" flexDirection="column" gap="1em">
          <Heading>Your identity has been verified 🥳</Heading>
          <AddToWallet
            tokenAddress="0x913E332d552b98355587BBa82b1256BCAdbCeD48"
            tokenSymbol="ICEKYC"
            tokenDecimals={0}
            tokenImage="https://icecreamswap.com/kyc.png"
            variant="success"
          >
            Add NFT to Metamask
          </AddToWallet>
        </Flex>
      )
    else if (!canPay)
      action = (
        <Button disabled height="40px" width="100%">
          Insufficient ICE balance
        </Button>
      )
    else
      action = (
        <Button onClick={handlePayment} height="40px" width="100%">
          Pay
        </Button>
      )
  } else {
    action = <ConnectWalletButton />
  }

  return (
    <Box background={isDark ? 'linear-gradient(135deg, #1d1c21 0%, #141317 100%)' : undefined}>
      <PageHeader
        background={isMobile ? `url(${kycAsset.src})` : '#E66280'}
        style={{
          backgroundPosition: 'right center',
          backgroundColor: '#E66280',
          backgroundRepeat: 'no-repeat',
        }}
        padding="0"
        // extra={<Bg />}
      >
        <Flex maxWidth="800px" margin="auto">
          <Box>
            <H1 as="h1" color={tokens.colors.dark.secondary} scale="xxl">
              KYC
            </H1>
            <H2 color="#F4EEFF">Verify your identity</H2>
          </Box>
          <ImgWrapper>
            <img src={kycAsset.src} alt="kyc" />
          </ImgWrapper>
        </Flex>
      </PageHeader>
      <Page style={{ maxWidth: '800px' }}>
        <Flex flexDirection="column" gap="0.75em">
          <Text>
            The IceCream KYC-Soulbound Token allows you to publicly prove you being KYCed with IceCreamSwap. For
            Projects that means you can get access to extra functionality and greatly increase your communities and
            other projects trust. For Users this means you might receive AirDrops where the KYC token is a prerequisite
            so projects are sure they don&apos;t AirDrop to bots.
          </Text>
          <Text>
            To get your token, you will need to pay a fee of {chain.kyc?.fee} {token?.symbol}. After you pay, you will
            be redirected to a KYC form, where you will need to provide your identity information. After you submit the
            form, your token will be sent to your wallet. The whole process just takes a few minutes.
          </Text>
          <Flex alignItems="center" gap="1em" flexDirection="column" justifyContent="stretch" marginTop="1em">
            {action}
          </Flex>
        </Flex>
      </Page>
    </Box>
  )
}

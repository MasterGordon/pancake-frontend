import { Box, Button, Flex, Heading, PageHeader, Text } from '@pancakeswap/uikit'
import { isMobile } from 'react-device-detect'
import { useAccount, useSigner } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useActiveChain } from 'hooks/useActiveChain'
import styled, { useTheme } from 'styled-components'
import kycAsset from './images/KYC.png'
import Page from 'components/Layout/Page'
import { tokens } from '@pancakeswap/ui'
import { useState } from 'react'

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

export const Airdrop: React.FC = () => {
  const chain = useActiveChain()
  const { address, status } = useAccount()
  const { data: signer } = useSigner()
  const [state, setState] = useState<string | undefined>()

  const onSubmit = async () => {
    setState('loading')
    try {
      const sig = await signer?.signMessage(address.toLowerCase())
      const res = await fetch(`api/submit-airdrop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: address.toLowerCase(), sig }),
      })
      const data = await res.json()
      setState(data.message)
    } catch (e) {
      setState(undefined)
    }
  }

  const { isDark } = useTheme()

  let action: React.ReactNode | undefined

  if (status === 'connected') {
    if (state === 'loading') {
      action = (
        <Button height="40px" width="100%" isLoading>
          Submit for Airdrop
        </Button>
      )
    } else if (state === 'success') {
      action = <Text>Succesfully submitted for airdrop. 🥳</Text>
    } else if (state === 'invalid-sig') {
      action = <Text>Invalid signature. Please try again</Text>
    } else if (state === '24h') {
      action = <Text>You have already submitted for airdrop. You can resubmit later</Text>
    } else {
      action = (
        <Button height="40px" width="100%" onClick={onSubmit}>
          Submit for Airdrop
        </Button>
      )
    }
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
              Fengchao Airdrop
            </H1>
            <H2 color="#F4EEFF">Apply now for free Tokens</H2>
          </Box>
          <ImgWrapper>
            <img src={kycAsset.src} alt="kyc" />
          </ImgWrapper>
        </Flex>
      </PageHeader>
      <Page style={{ maxWidth: '800px' }}>
        <Flex flexDirection="column" gap="0.75em">
          <Text>Submit for the Fengchao airdrop. You can only apply once every 24h.</Text>
          <Flex alignItems="center" gap="1em" flexDirection="column" justifyContent="stretch" marginTop="1em">
            {action}
          </Flex>
        </Flex>
      </Page>
    </Box>
  )
}

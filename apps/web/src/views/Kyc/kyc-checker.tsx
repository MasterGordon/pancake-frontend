import { Box, Flex, Heading, Input, PageHeader, Text } from '@pancakeswap/uikit'
import { isMobile } from 'react-device-detect'
import useSWR from 'swr'
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

export const KycChecker: React.FC = () => {
  const [input, setInput] = useState('')
  const paid = useSWR(
    input?.length === 42 ? `kyc/${input}` : null,
    async () => {
      const response = await fetch(`api/kyc-info/${input}`)
      const data = await response.json()
      return data as {
        type: string
        status: string
        source?: {
          address: string
        }
      }
    },
    { refreshInterval: 2000 },
  )

  const { isDark } = useTheme()

  let status: React.ReactNode = null
  if (paid.data?.type === 'kyc' && paid.data?.status === 'verified') {
    status = (
      <Text color="success" bold>
        KYCed ✔️
      </Text>
    )
  } else if (paid.data?.type === 'delegation' && paid.data?.status === 'MINTED') {
    status = (
      <Text color="success" bold>
        KYCed throgh delegation from {paid.data?.source?.address} ✔️
      </Text>
    )
  } else {
    status = (
      <Text color="warning" bold>
        Not KYCed ❌
      </Text>
    )
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
              KYC Checker
            </H1>
            <H2 color="#F4EEFF">Check others KYC status</H2>
          </Box>
          <ImgWrapper>
            <img src={kycAsset.src} alt="kyc" />
          </ImgWrapper>
        </Flex>
      </PageHeader>
      <Page style={{ maxWidth: '800px' }}>
        <Flex flexDirection="column" gap="0.75em">
          <Text>Enter the address of the wallet you want to check the KYC status of.</Text>
          <Flex alignItems="center" gap="1em" flexDirection="column" justifyContent="stretch" marginTop="1em">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="0x12345..." />
            <Heading>{status}</Heading>
          </Flex>
        </Flex>
      </Page>
    </Box>
  )
}

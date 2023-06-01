import { SUPPORT_SWAP } from '../../config/constants/supportChains'
import { AddToken } from '../../strict/views/Listing/AddToken'

const LocksOverviewPage = () => {
  return <AddToken />
}

LocksOverviewPage.chains = SUPPORT_SWAP

export default LocksOverviewPage

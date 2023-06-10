import { ThemeProvider, DefaultTheme } from "styled-components";
import { ChainIdProvider } from "./contexts/ChainIdContext/Provider";
import { MatchBreakpointsProvider } from "./contexts/MatchBreakpoints/Provider";
import { ToastsProvider } from "./contexts/ToastsContext/Provider";

export const UIKitProvider: React.FC<
  React.PropsWithChildren<{ theme: DefaultTheme; children: React.ReactNode; chainId: number }>
> = ({ theme, children, chainId }) => {
  return (
    <ChainIdProvider value={chainId}>
      <ThemeProvider theme={theme}>
        <MatchBreakpointsProvider>
          <ToastsProvider>{children}</ToastsProvider>
        </MatchBreakpointsProvider>
      </ThemeProvider>
    </ChainIdProvider>
  );
};

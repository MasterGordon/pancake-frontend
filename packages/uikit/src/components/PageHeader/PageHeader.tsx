import styled from "styled-components";
import { Box } from "../Box";
import Container from "../Layouts/Container";
import { PageHeaderProps } from "./types";

const Outer = styled(Box)<{ background?: string }>`
  background: ${({ theme, background }) => background || theme.colors.gradientBubblegum};
`;

const Inner = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;
  position: relative;
`;

const PageHeader: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({ background, children, extra, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
    {extra}
  </Outer>
);

export default PageHeader;

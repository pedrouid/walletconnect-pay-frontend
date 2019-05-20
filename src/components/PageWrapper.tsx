import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";

interface IPageWrapperStyleProps {
  center?: boolean;
  maxWidth?: number;
}

const SPageWrapper = styled.div<IPageWrapperStyleProps>`
  position: relative;
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "inherit")};
  height: 100%;
  max-height: 100vh;
  margin: 0 auto;
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  justify-content: ${({ center }) => (center ? "center" : "inherit")};
`;

interface IPageWrapperProps extends IPageWrapperStyleProps {
  children: React.ReactNode;
}

const PageWrapper = (props: IPageWrapperProps) => (
  <SPageWrapper center={props.center} maxWidth={props.maxWidth}>
    {props.children}
  </SPageWrapper>
);

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  center: PropTypes.bool,
  maxWidth: PropTypes.number
};

PageWrapper.defaultProps = {
  center: false,
  maxWidth: undefined
};

export default PageWrapper;

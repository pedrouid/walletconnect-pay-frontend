import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";

interface IPageWrapperStyleProps {
  center?: boolean;
  row?: boolean;
  maxWidth?: number;
  noPadding?: boolean;
  noScroll?: boolean;
}

const SPageWrapper = styled.div<IPageWrapperStyleProps>`
  position: relative;
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "initial")};
  height: 100%;
  max-height: ${({ noScroll }) => (noScroll ? "100vh" : "initial")};
  margin: 0 auto;
  overflow-x: hidden;
  overflow-y: ${({ noScroll }) => (noScroll ? "hidden" : "initial")};
  display: flex;
  flex-direction: ${({ row }) => (row ? "row" : "column")};
  align-items: center;
  padding: ${({ noPadding }) => (noPadding ? "0" : "20px")};
  justify-content: ${({ center }) => (center ? "center" : "inherit")};
`;

interface IPageWrapperProps extends IPageWrapperStyleProps {
  children: React.ReactNode;
}

const PageWrapper = (props: IPageWrapperProps) => (
  <SPageWrapper
    center={props.center}
    row={props.row}
    maxWidth={props.maxWidth}
    noPadding={props.noPadding}
    noScroll={props.noScroll}
  >
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

import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import Loader from "./Loader";
import { PAGE_PADDING, TOP_LAYER_PERC } from "../constants/layout";
import { colors, responsive } from "../styles";

interface IPageWrapperStyleProps {
  center?: boolean;
  row?: boolean;
  maxWidth?: number;
  noPadding?: boolean;
  noScroll?: boolean;
  topLayer?: boolean;
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
  padding: ${({ noPadding }) => (noPadding ? "0" : `${PAGE_PADDING}px`)};
  padding-top: ${({ topLayer }) =>
    topLayer ? `${TOP_LAYER_PERC * 0.6}vh` : "inherit"};
  justify-content: ${({ center }) => (center ? "center" : "inherit")};
  @media screen and (${responsive.sm.max}) {
    padding-top: ${({ topLayer }) =>
      topLayer ? `${TOP_LAYER_PERC * 0.3}vh` : "inherit"};
  }
`;

const STopLayer = styled.div`
  position: absolute;
  background: rgb(${colors.darkBlue});
  top: 0;
  right: 0;
  left: 0;
  z-index: -1;
  height: ${TOP_LAYER_PERC}vh;
  @media screen and (${responsive.sm.max}) {
    height: ${TOP_LAYER_PERC * 0.7}vh;
  }
`;

interface ILoaderStyleProps {
  topLayer?: boolean;
}

const SLoader = styled(Loader)<ILoaderStyleProps>`
  margin: ${({ topLayer }) => (topLayer ? `${TOP_LAYER_PERC}vh 0` : "inherit")};
`;

interface IPageWrapperProps extends IPageWrapperStyleProps {
  children: React.ReactNode;
  topLayer?: boolean;
  loading?: boolean;
}

const PageWrapper = (props: IPageWrapperProps) => (
  <SPageWrapper
    topLayer={props.topLayer}
    center={props.center}
    row={props.row}
    maxWidth={props.maxWidth}
    noPadding={props.noPadding}
    noScroll={props.noScroll}
  >
    {props.topLayer && <STopLayer />}
    {!props.loading ? (
      props.children
    ) : (
      <SLoader topLayer={props.topLayer} background="lightGrey" />
    )}
  </SPageWrapper>
);

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  center: PropTypes.bool,
  maxWidth: PropTypes.number,
  loading: PropTypes.bool,
  topLayer: PropTypes.bool
};

PageWrapper.defaultProps = {
  center: false,
  maxWidth: undefined,
  loading: false,
  topLayer: false
};

export default PageWrapper;

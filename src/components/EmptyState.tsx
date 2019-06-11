import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { SCenter } from "./common";
import { colors } from "../styles";
import Loader from "./Loader";

interface IEmptyStateStyleProps {
  color: string;
}

const SEmptyState = styled(SCenter)<IEmptyStateStyleProps>`
  background: rgb(${colors.white});
  & h6 {
    font-weight: normal;
    color: ${({ color }) => `rgb(${colors[color]})`};
  }
`;

const EmptyState = (props: any) => (
  <SEmptyState color={props.color}>
    {!props.loading ? (
      <React.Fragment>
        <h6>{props.message}</h6>
        {props.children}
      </React.Fragment>
    ) : (
      <Loader color={props.color} />
    )}
  </SEmptyState>
);

EmptyState.propTypes = {
  color: PropTypes.string,
  message: PropTypes.string,
  loading: PropTypes.bool
};

EmptyState.defaultProps = {
  color: "grey",
  message: "No Items",
  loading: false
};

export default EmptyState;

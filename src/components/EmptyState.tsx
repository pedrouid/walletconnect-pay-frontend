import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { SCenter } from "./common";
import { colors } from "../styles";

const SEmptyState = styled(SCenter)`
  background: rgb(${colors.white});
  & h6 {
    font-weight: normal;
    color: rgb(${colors.grey});
  }
`;

const EmptyState = (props: any) => (
  <SEmptyState>
    <h6>{props.message}</h6>
    {props.children}
  </SEmptyState>
);

EmptyState.propTypes = {
  message: PropTypes.string
};

EmptyState.defaultProps = {
  message: "No Items"
};

export default EmptyState;

import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "../styles";

interface IIconStyleProps {
  icon: string;
  size: number;
  color: string;
}

const SIcon = styled.img<IIconStyleProps>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  mask: ${({ icon }) => `url(${icon}) center no-repeat`};
  mask-size: 95%;
  background-color: ${({ color }) => `rgb(${colors[color]})`};
`;

const Icon = (props: any) => (
  <SIcon icon={props.icon} size={props.size} color={props.color} {...props} />
);

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string
};

Icon.defaultProps = {
  src: null,
  fallback: null,
  size: 20,
  color: "dark"
};

export default Icon;

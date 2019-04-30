import * as React from "react";
import styled from "styled-components";
import Loader from "./Loader";
import { colors, fonts, shadows, transitions } from "../styles";

interface IButtonStyleProps {
  fetching: boolean;
  outline: boolean;
  type: "button" | "reset" | "submit";
  color: string;
  disabled: boolean;
}

interface IButtonProps extends IButtonStyleProps {
  children: React.ReactNode;
  onClick?: any;
}

const SHoverLayer = styled.div`
  transition: ${transitions.base};
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgb(${colors.white}, 0.1);
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
`;

const SButtonStyleTypes = styled.button<IButtonStyleProps>``;
const SButton = styled(SButtonStyleTypes)`
  transition: ${transitions.base};
  width: 100%;
  position: relative;
  border: none;
  border-style: none;
  box-sizing: border-box;
  background-color: ${({ outline, color }) =>
    outline ? "transparent" : `rgb(${colors[color]})`};
  border: ${({ outline, color }) =>
    outline ? `1px solid rgb(${colors[color]})` : "none"};
  color: ${({ outline, color }) =>
    outline ? `rgb(${colors[color]})` : `rgb(${colors.white})`};
  box-shadow: ${({ outline }) => (outline ? "none" : `${shadows.base}`)};
  border-radius: 4px;
  font-size: ${fonts.size.large};
  font-weight: ${fonts.weight.semibold};
  padding: 16px;
  margin: 10px 0;
  cursor: ${({ disabled }) => (disabled ? "auto" : "pointer")};
  will-change: transform;

  &:disabled {
    opacity: 0.6;
    box-shadow: ${({ outline }) => (outline ? "none" : `${shadows.base}`)};
  }

  @media (hover: hover) {
    &:hover {
      transform: ${({ disabled }) => (!disabled ? "translateY(-1px)" : "none")};
      box-shadow: ${({ disabled, outline }) =>
        !disabled
          ? outline
            ? "none"
            : `${shadows.hover}`
          : `${shadows.base}`};
    }

    &:hover ${SHoverLayer} {
      opacity: 1;
      visibility: visible;
    }
  }

  &:active {
    transform: ${({ disabled }) => (!disabled ? "translateY(1px)" : "none")};
    box-shadow: ${({ outline }) => (outline ? "none" : `${shadows.base}`)};
    color: ${({ outline, color }) =>
      outline ? `rgb(${colors[color]})` : `rgba(${colors.white}, 0.24)`};
  }
`;

const Button = (props: IButtonProps) => (
  <SButton
    type={props.type}
    outline={props.outline}
    color={props.color}
    disabled={props.disabled}
    {...props}
  >
    <SHoverLayer />
    {props.fetching ? (
      <Loader size={20} color="white" background={props.color} />
    ) : (
      props.children
    )}
  </SButton>
);

Button.defaultProps = {
  fetching: false,
  outline: false,
  type: "button",
  color: "green",
  disabled: false
};

export default Button;

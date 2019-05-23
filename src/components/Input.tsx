import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { colors, fonts, shadows } from "../styles";

interface IInputWrapperStyleProps {
  disabled: boolean;
}

const SInputWrapper = styled.div<IInputWrapperStyleProps>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};
`;

const SLabel = styled.label`
  color: rgb(${colors.grey});
  font-size: ${fonts.size.small};
  font-weight: ${fonts.weight.semibold};
  width: 100%;
  margin-top: 16px;

  & ~ input,
  & ~ div {
    margin-top: 8px;
  }
`;

interface IInputStyleProps {
  monospace: boolean;
}

const SInput = styled.input<IInputStyleProps>`
  width: 100%;
  background: rgb(${colors.white});
  padding: 10px 14px;
  border: none;
  border-style: none;
  font-family: ${({ monospace }) =>
    monospace ? `${fonts.family.RobotoMono}` : `inherit`};
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.semibold};
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  border-radius: 6px;
  -webkit-box-shadow: ${shadows.medium};
  box-shadow: ${shadows.medium};
  outline: none;

  &::placeholder {
    color: rgba(${colors.grey}, 0.8);
    font-weight: ${fonts.weight.medium};
    opacity: 1;
  }
`;

const Input = (props: any) => {
  const {
    children,
    label,
    type,
    disabled,
    value,
    placeholder,
    monospace
  } = props;
  let _label = label;
  let _placeholder = placeholder;
  if (!label) {
    if (type === "email") {
      _label = "Email";
      _placeholder = "your@email.com";
    } else if (type === "password") {
      _label = "Password";
      _placeholder = "••••••••••";
    } else if (type === "text") {
      _label = "Input";
    }
  }
  if (!placeholder) {
    if (type === "email") {
      _placeholder = "your@email.com";
    } else if (type === "password") {
      _placeholder = "••••••••••";
    } else if (type === "text") {
      _placeholder = "Type here";
    }
  }
  return (
    <SInputWrapper disabled={disabled}>
      {_label !== "Input" && <SLabel>{_label}</SLabel>}
      <SInput
        disabled={disabled}
        type={type}
        value={!disabled ? value : ""}
        placeholder={_placeholder}
        monospace={monospace}
        {...props}
      />
      {children}
    </SInputWrapper>
  );
};

Input.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  monospace: PropTypes.bool,
  disabled: PropTypes.bool
};

Input.defaultProps = {
  label: "",
  placeholder: "",
  monospace: false,
  disabled: false
};

export default Input;

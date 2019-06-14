import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { SLabel } from "./common";
import Icon from "./Icon";
import editIcon from "../assets/edit.svg";
import { colors, fonts, shadows, transitions } from "../styles";

interface IInputWrapperStyleProps {
  disabled: boolean;
  readOnly?: boolean;
}

const SEditIcon = styled(Icon)`
  transition: ${transitions.short};
  position: absolute;
  right: ${({ size }) => `${size / 2}px`};
  cursor: auto;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  bottom: 6px;
  mask-size: 90%;
`;

const SInputWrapper = styled.div<IInputWrapperStyleProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};

  @media (hover: hover) {
    &:hover ${SEditIcon} {
      cursor: ${({ readOnly }) => (readOnly ? "pointer" : "auto")};
      opacity: ${({ readOnly }) => (readOnly ? 1 : 0)};
      visibility: ${({ readOnly }) => (readOnly ? "visible" : "hidden")};
      pointer-events: ${({ readOnly }) => (readOnly ? "auto" : "none")};
    }
  }
`;

interface IInputStyleProps {
  monospace: boolean;
}

const SInput = styled.input<IInputStyleProps>`
  width: 100%;
  background: rgb(${colors.white});
  color: rgb(${colors.dark});
  padding: ${({ readOnly }) => (!readOnly ? "0.5em 0.75em" : "0.5em 0")};
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
  box-shadow: ${({ readOnly }) => (!readOnly ? shadows.medium : "none")};
  outline: none;

  &::placeholder {
    color: rgba(${colors.grey}, 0.8);
    font-weight: ${fonts.weight.medium};
    opacity: 1;
  }
`;

class Input extends React.Component<any, any> {
  public static propTypes = {
    children: PropTypes.node,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    monospace: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool
  };

  public static defaultProps = {
    label: "",
    placeholder: "",
    monospace: false,
    disabled: false
  };

  public inputRef: React.RefObject<HTMLInputElement>;

  set input(value: any) {
    return;
  }

  get input() {
    const _input: HTMLInputElement | null =
      this.inputRef && this.inputRef.current ? this.inputRef.current : null;
    return _input;
  }

  public state = {
    editing: false
  };

  constructor(props: any) {
    super(props);
    this.inputRef = React.createRef();
  }

  public componentDidMount() {
    if (this.input) {
      this.input.addEventListener("keyup", this.subscribeToKeyUp);
      this.input.addEventListener("blur", this.onBlur);
    }
  }

  public toggleEditing = () => this.setState({ editing: !this.state.editing });

  public subscribeToKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      if (this.state.editing) {
        this.toggleEditing();
      }
      if (this.input) {
        this.input.blur();
      }
      this.onSubmit();
    }
  };

  public onSubmit = () => {
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
  };

  public onBlur = () => {
    this.onSubmit();
  };

  public componentWillUnmount() {
    if (this.input) {
      this.input.removeEventListener("keyup", this.subscribeToKeyUp);
      this.input.removeEventListener("blur", this.onBlur);
    }
  }

  public render() {
    const {
      children,
      label,
      type,
      disabled,
      value,
      placeholder,
      monospace,
      editMode,
      ...props
    } = this.props;
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
    const readOnly = editMode && !this.state.editing;
    return (
      <SInputWrapper disabled={disabled} readOnly={readOnly}>
        {_label !== "Input" && <SLabel>{_label}</SLabel>}
        <SInput
          ref={this.inputRef}
          readOnly={readOnly}
          disabled={disabled || readOnly}
          type={type}
          value={!disabled ? value : ""}
          placeholder={_placeholder}
          monospace={monospace}
          {...props}
        />
        {children}
        <SEditIcon
          size={25}
          icon={editIcon}
          color="dark"
          onClick={this.toggleEditing}
        />
      </SInputWrapper>
    );
  }
}

export default Input;

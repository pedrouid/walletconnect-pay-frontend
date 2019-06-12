import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import Button from "./Button";

interface IImageWrapperStyleProps {
  imgSize: number;
}

const SImageWrapper = styled.div<IImageWrapperStyleProps>`
  position: absolute;
  height: ${({ imgSize }) => `${imgSize}px`};
  width: ${({ imgSize }) => `${imgSize}px`};
  margin: 0 8px;
  top: ${({ imgSize }) => `calc((100% - ${imgSize}px) / 2)`};
  & img {
    width: 100%;
    height: 100%;
  }
`;

interface IButtonWithImageStyleProps {
  imgSrc: string;
  left?: boolean;
}

const SButton = styled(Button)<IButtonWithImageStyleProps>`
  padding: ${({ imgSrc, left }) =>
    imgSrc ? (left ? "8px 12px 8px 28px" : "8px 28px 8px 12px") : "8px 12px"};

  & ${SImageWrapper} {
    right: ${({ left }) => (left ? "auto" : "0")};
    left: ${({ left }) => (left ? "0" : "auto")};
    display: ${({ imgSrc }) => (imgSrc ? "block" : "none")};
  }
`;

const ButtonWithImage = (props: any) => {
  const {
    fetching,
    type,
    outline,
    color,
    disabled,
    icon,
    imgSrc,
    imgSize,
    left,
    children,
    ...otherProps
  } = props;
  console.log("[ButtonWithImage] props", props); // tslint:disable-line
  return (
    <SButton
      type={type}
      outline={outline}
      color={color}
      disabled={disabled}
      icon={icon}
      fetching={fetching}
      imgSrc={imgSrc}
      left={left}
      {...otherProps}
    >
      <SImageWrapper imgSize={imgSize}>
        <img src={imgSrc} alt="imgSrc" />
      </SImageWrapper>
      {children}
    </SButton>
  );
};

ButtonWithImage.propTypes = {
  children: PropTypes.node.isRequired,
  imgSrc: PropTypes.string.isRequired,
  imgSize: PropTypes.number,
  left: PropTypes.bool
};

ButtonWithImage.defaultProps = {
  imgSize: 30,
  left: false
};

export default ButtonWithImage;

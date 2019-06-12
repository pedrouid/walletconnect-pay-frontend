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
  margin: ${({ imgSize }) => `0 ${imgSize / 2}px`};
  top: ${({ imgSize }) => `calc((100% - ${imgSize}px) / 2)`};
  & img {
    width: 100%;
    height: 100%;
  }
`;

interface IButtonWithImageStyleProps {
  imgSrc: string;
  imgSize: number;
  left?: boolean;
}

const SButton = styled(Button)<IButtonWithImageStyleProps>`
  padding: ${({ imgSrc, imgSize, left }) =>
    imgSrc
      ? left
        ? `${imgSize / 2}px ${imgSize / 1.33}px ${imgSize / 2}px ${imgSize /
            0.58}px`
        : `${imgSize / 2}px ${imgSize / 0.58}px ${imgSize / 2}px ${imgSize /
            1.33}px`
      : "inherit"};

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
  return (
    <SButton
      type={type}
      outline={outline}
      color={color}
      disabled={disabled}
      icon={icon}
      fetching={fetching}
      imgSrc={imgSrc}
      imgSize={imgSize}
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
  imgSize: 16,
  left: false
};

export default ButtonWithImage;

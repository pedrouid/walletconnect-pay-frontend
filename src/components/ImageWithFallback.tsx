import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import placeholder from "../assets/placeholder.png";
import { colors, fonts } from "../styles";
import { stringToCapitals, stringToHexColor } from "../helpers/utilities";

interface IImageWithFallbackStyleProps {
  size: number;
  show: boolean;
  hexColor?: string;
}

const SImageWithFallback = styled.div<IImageWithFallbackStyleProps>`
  position: relative;
  border-radius: ${({ size }) => `${size / 7.5}px`};
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  display: flex;
  align-items: center;
  justify-content: center;
  & img {
    width: 100%;
    display: ${({ show }) => (show ? "block" : "none")};
  }
`;

const SFallbackText = styled.div<IImageWithFallbackStyleProps>`
  width: 100%;
  display: ${({ show }) => (show ? "block" : "none")};
  justify-content: center;
  align-items: center;

  & > div {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(${colors.white});
    font-size: ${fonts.size.h3};
    padding: 4px;
  }

  &:before {
    content: "";
    display: block;
    padding-bottom: 100%;
    border-radius: ${({ size }) => `${size / 7.5}px`};
    background: ${({ hexColor }) => `#${hexColor}`};
  }
`;

class ImageWithFallback extends React.Component<any, any> {
  public static propTypes = {
    src: PropTypes.string.isRequired,
    fallbackText: PropTypes.bool,
    alt: PropTypes.string,
    size: PropTypes.number
  };

  public static defaultProps = {
    size: 45
  };

  public imgRef: React.RefObject<HTMLImageElement>;

  set img(value: any) {
    return;
  }

  get img() {
    const _img: HTMLImageElement | null =
      this.imgRef && this.imgRef.current ? this.imgRef.current : null;
    return _img;
  }

  constructor(props: any) {
    super(props);
    this.imgRef = React.createRef();
  }

  public componentDidUpdate(prevProps: any) {
    console.log("[componentDidUpdate] this.props", this.props); // tslint:disable-line
    console.log("[componentDidUpdate] prevProps", prevProps); // tslint:disable-line
    this.updateSrc(prevProps);
  }

  public updateSrc = (prevProps?: any) => {
    if (this.img) {
      if (!this.props.src && !this.props.fallbackText) {
        console.log("[updateSrc] this.img", this.img); // tslint:disable-line
        this.img.src = placeholder;
      } else if (
        this.props.src &&
        (prevProps && this.props.src !== prevProps.src)
      ) {
        console.log("[updateSrc] this.props.src", this.props.src); // tslint:disable-line
        this.img.src = this.props.src;
      }
    }
  };

  public render() {
    const { src, fallbackText, alt, size, ...props } = this.props;
    const _fallbackText = fallbackText ? stringToCapitals(fallbackText) : "";
    const _fallbacKHexColor = stringToHexColor(_fallbackText);
    return (
      <SImageWithFallback
        show={src || (!src && !fallbackText)}
        size={size}
        {...props}
      >
        <img
          ref={this.imgRef}
          src={src}
          alt={alt}
          onError={(event: any) => this.updateSrc()}
        />
        {fallbackText && (
          <SFallbackText
            hexColor={_fallbacKHexColor}
            show={!src && fallbackText}
            size={size}
          >
            <div>{_fallbackText}</div>
          </SFallbackText>
        )}
      </SImageWithFallback>
    );
  }
}

ImageWithFallback.propTypes = {
  src: PropTypes.string.isRequired,
  fallbackText: PropTypes.bool,
  alt: PropTypes.string,
  size: PropTypes.number
};

ImageWithFallback.defaultProps = {
  size: 45
};

export default ImageWithFallback;
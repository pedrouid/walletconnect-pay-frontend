import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import Icon from "./Icon";
import Loader from "./Loader";
import uploadIcon from "../assets/upload.svg";
import editIcon from "../assets/edit.svg";
import { colors, transitions } from "../styles";
import { SLabel } from "./common";
import { sanitizeImgSrc } from "../helpers/utilities";

const IMAGE_PADDING = 5;

const SUploadWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

interface IUploadButtonStyleProps {
  disabled?: boolean;
  color: string;
  size: number;
  ratio: number;
}

const SEditIcon = styled(Icon)`
  transition: ${transitions.short};
  position: absolute;
  right: ${({ size }) => `${size / 2}px`};
  top: ${({ size }) => `${size / 2}px`};
  cursor: auto;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
`;

const SUploadButton = styled.button<IUploadButtonStyleProps>`
  position: relative;
  border: none;
  border-style: none;
  box-sizing: border-box;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(${colors.white});
  cursor: ${({ disabled }) => (disabled ? "auto" : "pointer")};
  will-change: transform;
  transition: ${transitions.button};
  width: ${({ size }) => `${size}px`};
  height: ${({ size, ratio }) => `${size * ratio}px`};
  margin-top: 8px;
  border: ${({ color, disabled }) =>
    !disabled
      ? `2px dotted rgb(${colors[color]})`
      : `2px solid rgb(${colors[color]})`};
  @media (hover: hover) {
    &:hover {
      transform: ${({ disabled }) => (!disabled ? "translateY(-1px)" : "none")};
    }

    &:hover ${SEditIcon} {
      cursor: pointer;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }
  }
`;

interface IImageDisplayStyledProps {
  image: string;
}

const SImageDisplay = styled.div<IImageDisplayStyledProps>`
  position: absolute;
  top: ${IMAGE_PADDING}px;
  bottom: ${IMAGE_PADDING}px;
  left: ${IMAGE_PADDING}px;
  right: ${IMAGE_PADDING}px;
  overflow: hidden;
  background-image: ${({ image }) => `url(${image})`};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

class Upload extends React.Component<any, any> {
  public static propTypes = {
    apiHandler: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func,
    color: PropTypes.string,
    size: PropTypes.number,
    label: PropTypes.string,
    image: PropTypes.string
  };

  public static defaultProps = {
    color: "grey",
    size: 200,
    ratio: 1,
    label: ""
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
    uploading: false,
    result: ""
  };

  constructor(props: any) {
    super(props);
    this.inputRef = React.createRef();
  }

  public onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { apiHandler, onSuccess, onError } = this.props;
    if (event.target && event.target.files) {
      this.setState({ uploading: true });
      try {
        const files = Array.from(event.target.files);

        const result = await apiHandler(files);

        this.setState({ uploading: false, result });
        onSuccess(result);
      } catch (err) {
        this.setState({ uploading: false });
        if (onError) {
          onError(err);
        }
      }
    }
  };

  public onClick = () => {
    if (this.input) {
      this.input.click();
    }
  };

  public render() {
    const { uploading, result } = this.state;
    const { color, size, ratio, label } = this.props;
    const image = result || this.props.image;
    return (
      <SUploadWrapper>
        {!!label && <SLabel>{label}</SLabel>}
        <SUploadButton
          disabled={!!image && !uploading}
          size={size}
          color={color}
          ratio={ratio}
          onClick={this.onClick}
        >
          <input
            ref={this.inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={this.onUpload}
          />
          {image && !uploading ? (
            <React.Fragment>
              <SImageDisplay image={sanitizeImgSrc(image)} />
              <SEditIcon
                size={(5 * size) / 40}
                icon={editIcon}
                color={color}
                onClick={this.onClick}
              />
            </React.Fragment>
          ) : !uploading ? (
            <Icon size={size / 4} icon={uploadIcon} color={color} />
          ) : (
            <Loader size={size / 4} color={color} />
          )}
        </SUploadButton>
      </SUploadWrapper>
    );
  }
}

export default Upload;

import * as React from "react";
import * as PropTypes from "prop-types";
import { apiPinFile } from "../helpers/api";
import Upload from "../components/Upload";
import { resizeImage } from "../helpers/image";

class UploadToIpfs extends React.Component<any, any> {
  public static propTypes = {
    onUpload: PropTypes.func.isRequired,
    color: PropTypes.string,
    size: PropTypes.number,
    label: PropTypes.string,
    image: PropTypes.string
  };

  public handleApiUpload = async (files: File[]) => {
    const formData = new FormData();

    const image = files[0];

    const resizedImage = await resizeImage(image);

    formData.append("file", resizedImage);

    const result = await apiPinFile(formData);

    return result;
  };

  public onUpload = (image: string) => this.props.onUpload(image);

  public render() {
    const { color, size, label, image } = this.props;
    return (
      <Upload
        color={color}
        size={size}
        label={label}
        image={image}
        apiHandler={this.handleApiUpload}
        onSuccess={this.onUpload}
        onError={console.error} // tslint:disable-line
      />
    );
  }
}

export default UploadToIpfs;

import * as React from "react";
import * as PropTypes from "prop-types";
import { apiPinFile } from "../helpers/api";
import { getIpfsUrl, getIpfsHash } from "../helpers/utilities";
import Upload from "../components/Upload";

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

    files.forEach((file: File, idx: number) => {
      formData.append(`${idx}`, file);
    });

    const fileHash = await apiPinFile(formData);

    let result = "";

    if (fileHash) {
      result = getIpfsUrl(fileHash);
    }

    return result;
  };

  public onUpload = (url: string) => this.props.onUpload(getIpfsHash(url));

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

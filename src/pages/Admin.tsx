import * as React from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import PageWrapper from "../components/PageWrapper";

class Admin extends React.Component<any, any> {
  public static propTypes = {
    businessData: PropTypes.string.isRequired
  };

  public render() {
    return (
      <PageWrapper>
        <h4>{`Admin`}</h4>
        <p>
          {this.props.businessData ? this.props.businessData.profile.name : ""}
        </p>
      </PageWrapper>
    );
  }
}

const reduxProps = (store: any) => ({
  businessData: store.admin.businessData
});

export default connect(
  reduxProps,
  null
)(Admin);

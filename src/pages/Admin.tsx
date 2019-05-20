import * as React from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import PageWrapper from "../components/PageWrapper";

class Admin extends React.Component<any, any> {
  public static propTypes = {
    businessName: PropTypes.string.isRequired
  };

  public render() {
    return (
      <PageWrapper>
        <h4>{`Admin`}</h4>
        <p>{this.props.businessName}</p>
      </PageWrapper>
    );
  }
}

const reduxProps = (store: any) => ({
  businessName: store.admin.businessName
});

export default connect(
  reduxProps,
  null
)(Admin);

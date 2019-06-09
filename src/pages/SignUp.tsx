import * as React from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import {
  adminRequestAuthentication,
  adminUpdateBusinessProfile,
  adminSubmitSignUp
} from "../redux/_admin";
import ProfileForm from "../components/ProfileForm";

interface ISignUpProps {
  adminUpdateBusinessProfile: (updatedBusinessProfile: any) => void;
  adminSubmitSignUp: () => void;
  name: string;
  type: string;
  country: string;
  email: string;
}

class SignUp extends React.Component<any, ISignUpProps> {
  public static propTypes = {
    adminUpdateBusinessProfile: PropTypes.func.isRequired,
    adminSubmitSignUp: PropTypes.func.isRequired,
    address: PropTypes.string.isRequired,
    businessProfile: PropTypes.object.isRequired
  };

  public componentDidMount() {
    if (!this.props.address) {
      this.props.adminRequestAuthentication();
    }
  }

  public render() {
    return (
      <PageWrapper>
        <Card shadow margin={20}>
          <ProfileForm
            title={`Sign Up`}
            businessProfile={this.props.businessProfile}
            onInputChange={this.props.adminUpdateBusinessProfile}
            onSubmit={this.props.adminSubmitSignUp}
          />
        </Card>
      </PageWrapper>
    );
  }
}

const reduxProps = (store: any) => ({
  address: store.admin.address,
  businessProfile: store.admin.businessProfile
});

export default connect(
  reduxProps,
  { adminRequestAuthentication, adminUpdateBusinessProfile, adminSubmitSignUp }
)(SignUp);

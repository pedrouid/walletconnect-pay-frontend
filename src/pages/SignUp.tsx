import * as React from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import {
  adminRequestAuthentication,
  adminUpdateProfile,
  adminSubmitSignUp
} from "../redux/_admin";
import ProfileForm from "../components/ProfileForm";

interface ISignUpProps {
  adminUpdateProfile: (updatedProfile: any) => void;
  adminSubmitSignUp: () => void;
  name: string;
  type: string;
  country: string;
  email: string;
}

class SignUp extends React.Component<any, ISignUpProps> {
  public static propTypes = {
    adminUpdateProfile: PropTypes.func.isRequired,
    adminSubmitSignUp: PropTypes.func.isRequired,
    address: PropTypes.string.isRequired,
    profile: PropTypes.object.isRequired
  };

  public componentDidMount() {
    if (!this.props.address) {
      this.props.adminRequestAuthentication();
    }
  }

  public render() {
    return (
      <PageWrapper topLayer>
        <Card shadow margin={20}>
          <ProfileForm
            title={`Sign Up`}
            profile={this.props.profile}
            onInputChange={this.props.adminUpdateProfile}
            onSubmit={this.props.adminSubmitSignUp}
          />
        </Card>
      </PageWrapper>
    );
  }
}

const reduxProps = (store: any) => ({
  address: store.admin.address,
  profile: store.admin.profile
});

export default connect(
  reduxProps,
  { adminRequestAuthentication, adminUpdateProfile, adminSubmitSignUp }
)(SignUp);

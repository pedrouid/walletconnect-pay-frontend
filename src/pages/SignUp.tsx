import * as React from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import PageWrapper from "../components/PageWrapper";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import { adminUpdateSignUpForm } from "../reducers/_admin";
import businessTypes from "../ref/businessTypes";
import countries from "src/ref/countries";

class SignUp extends React.Component<any, any> {
  public static propTypes = {
    adminUpdateSignUpForm: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  };

  public render() {
    return (
      <PageWrapper maxWidth={600}>
        <h4>{`Sign Up`}</h4>

        <Input
          type="text"
          label="Business Name"
          placeholder="Crypto Café"
          value={this.props.name}
          disabled={false}
          onChange={(e: any) =>
            this.props.adminUpdateSignUpForm({ name: e.target.value })
          }
        />

        <Dropdown
          label="Business Type"
          selected={this.props.type}
          options={businessTypes}
          displayKey={"display_type"}
          targetKey={"type"}
          onChange={(type: string) =>
            this.props.adminUpdateSignUpForm({ type })
          }
        />

        <Input
          type="email"
          label="Email"
          placeholder="contact@cryptocafe.com"
          value={this.props.email}
          disabled={false}
          onChange={(e: any) =>
            this.props.adminUpdateSignUpForm({ email: e.target.value })
          }
        />

        <Dropdown
          label="Country"
          selected={this.props.country}
          options={countries}
          displayKey={"name"}
          targetKey={"code"}
          onChange={(country: string) =>
            this.props.adminUpdateSignUpForm({ country })
          }
        />
      </PageWrapper>
    );
  }
}

const reduxProps = (reduxState: any) => ({
  name: reduxState.admin.signUpForm.name,
  type: reduxState.admin.signUpForm.type,
  country: reduxState.admin.signUpForm.country,
  email: reduxState.admin.signUpForm.email
});

export default connect(
  reduxProps,
  { adminUpdateSignUpForm }
)(SignUp);

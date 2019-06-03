import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import PageWrapper from "../components/PageWrapper";
import { getCountryName } from "src/helpers/utilities";

const SLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 125px;
  margin: 20px auto;
  & img {
    width: 100%;
  }
`;

const SLabel = styled.p`
  font-weight: bold;
`;

class Admin extends React.Component<any, any> {
  public static propTypes = {
    businessData: PropTypes.string.isRequired
  };

  public render() {
    const { profile } = this.props.businessData;
    return (
      <PageWrapper>
        <h4>{`Admin`}</h4>
        <SLogo>
          <img src={profile.log} alt={profile.name} />
        </SLogo>
        <SLabel>{"Type"}</SLabel>
        <p>{profile.type}</p>
        <SLabel>{"Country"}</SLabel>
        <p>{getCountryName(profile.country)}</p>
        <SLabel>{"Email"}</SLabel>
        <p>{profile.email}</p>
        <SLabel>{"Phone"}</SLabel>
        <p>{profile.phone}</p>
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

import * as React from "react";
import PageWrapper from "../components/PageWrapper";
import { Link } from "react-router-dom";

const NotFound = () => (
  <PageWrapper center>
    <Link to="/">
      <h1>{`404 Not Found`}</h1>
    </Link>
  </PageWrapper>
);

export default NotFound;

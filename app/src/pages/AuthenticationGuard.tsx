import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { type ComponentType } from "react";

import { PageLoader } from "./PageLoader/PageLoader";

interface AuthenticationGuardProps {
  component: ComponentType;
}

export const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({
  component,
}) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="page-layout">
        <PageLoader />
      </div>
    ),
  });

  return <Component />;
};

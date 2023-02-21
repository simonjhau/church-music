import "./PageLoader.css";

import React from "react";

export const PageLoader: React.FC = () => {
  const loadingImg = "https://cdn.auth0.com/blog/hello-auth0/loader.svg";

  return (
    <div className="loaderPage">
      <div className="loader">
        <img src={loadingImg} alt="Loading..." />
      </div>
    </div>
  );
};

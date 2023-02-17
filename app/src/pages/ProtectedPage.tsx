import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL as string;

export const ProtectedPage: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getBooks = async (): Promise<void> => {
      const accessToken = await getAccessTokenSilently();
      fetch("/api/books", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(async (response) => await response.json())
        .then((response) => {
          setMessage(JSON.stringify(response));
        })
        .catch(() => {
          setMessage("fail");
        });
    };

    // eslint-disable-next-line no-console
    getBooks().catch(console.error);
  }, [getAccessTokenSilently]);

  return (
    <div className="content-layout">
      <h1 id="page-title" className="content__title">
        Protected Page
      </h1>
      <h1>{message}</h1>
      <div className="content__body">
        <p id="page-description">
          <span>
            This page retrieves a <strong>protected message</strong> from an
            external API.
          </span>
          <span>
            <strong>Only authenticated users can access this page.</strong>
          </span>
        </p>
      </div>
    </div>
  );
};

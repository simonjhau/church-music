import { useAuth0 } from "@auth0/auth0-react";
import { Container, Stack } from "@mui/material";
import axios from "axios";
import { type ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { SearchBox } from "../components/general/SearchBox";
import { MassDisplay } from "../components/massAdmin/MassDisplay";
import { NewMassButtonModal } from "../components/massAdmin/NewMassButtonModal";
import { TypeAndBookProvider } from "../context/TypesAndBooksContext";
import { type Mass } from "../types";

export const MassAdminPage = (): ReactElement => {
  const { getAccessTokenSilently } = useAuth0();

  const massId = useParams()["*"];
  const [massData, setMassData] = useState<Mass | null>(null);

  const refreshMassData = (endpoint: string | undefined): void => {
    const getHymns = async (): Promise<void> => {
      if (endpoint) {
        const token = await getAccessTokenSilently();
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMassData(res.data);
      } else {
        setMassData(null);
      }
    };

    getHymns().catch((e) => {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(msg);
    });
  };

  useEffect(() => {
    if (massId) {
      refreshMassData(`/api/masses/${massId}`);
    } else {
      refreshMassData("");
    }
  }, [massId]);

  return (
    <TypeAndBookProvider>
      <Container
        sx={{ alignItems: "center", maxWidth: { md: "700px", lg: "700px" } }}
      >
        <Stack spacing={2}>
          <SearchBox
            type="mass"
            value={massData}
            setValue={setMassData}
            apiUrl="/api/masses/"
            navigateOnSelection={true}
          />
          <NewMassButtonModal initialMassName="" />

          {massData && (
            <MassDisplay
              massData={massData}
              setMassData={setMassData}
            ></MassDisplay>
          )}
        </Stack>
      </Container>
    </TypeAndBookProvider>
  );
};

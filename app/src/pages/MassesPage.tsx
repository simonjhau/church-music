import { useAuth0 } from "@auth0/auth0-react";
import { Container, Grid, Stack } from "@mui/material";
import axios from "axios";
import { type ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { SearchBox } from "../components/general/SearchBox";
import { MassDisplay } from "../components/mass/MassDisplay";
import { NewMassButtonModal } from "../components/mass/NewMassButtonModal";
import { TypeAndBookProvider } from "../context/TypesAndBooksContext";
import { type Mass } from "../types";

export const MassesPage = (): ReactElement => {
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
    }
  }, []);

  return (
    <TypeAndBookProvider>
      <Container
        sx={{ alignItems: "center", maxWidth: { md: "700px", lg: "700px" } }}
      >
        <Stack
          sx={{
            py: 2,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={9}>
              <SearchBox
                type="mass"
                value={massData}
                setValue={setMassData}
                apiUrl="/api/masses/"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <NewMassButtonModal
                initialMassName=""
                setMassData={setMassData}
              />
            </Grid>
          </Grid>

          {massData && (
            <MassDisplay
              massData={massData}
              setMassData={setMassData}
              refreshMassData={refreshMassData}
            ></MassDisplay>
          )}
        </Stack>
      </Container>
    </TypeAndBookProvider>
  );
};

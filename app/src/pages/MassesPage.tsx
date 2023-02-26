import { useAuth0 } from "@auth0/auth0-react";
import { Container, Grid, Stack } from "@mui/material";
import axios from "axios";
import { type ReactElement, useState } from "react";

import { SearchBox } from "../components/general/SearchBox";
import { MassDisplay } from "../components/mass/MassDisplay";
// import NewHymnButtonModal from "../components/hymns/NewHymnButtonModal";
import { type Mass } from "../types";

export const MassesPage = (): ReactElement => {
  const { getAccessTokenSilently } = useAuth0();

  // Set edit mode to false on first render
  // const { setEditMode } = useEditMode();
  // useEffect(() => {
  //   // setEditMode(false);
  // }, []);

  const [massData, setMassData] = useState<Mass | null>(null);

  const refreshMassData = (endpoint: string | undefined): void => {
    console.log(endpoint);
    const getHymns = async (): Promise<void> => {
      if (endpoint) {
        const token = await getAccessTokenSilently();
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMassData(res.data[0]);
      } else {
        setMassData(null);
      }
    };

    getHymns().catch((e) => {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(msg);
    });
  };

  return (
    <Container
      sx={{ alignItems: "center", maxWidth: { md: "700px", lg: "700px" } }}
    >
      <Stack
        sx={{
          py: 2,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <SearchBox
              type="mass"
              value={massData}
              setValue={setMassData}
              apiUrl="/api/masses/"
            />
          </Grid>
        </Grid>

        {massData && (
          <MassDisplay
            massData={massData}
            refreshMassData={refreshMassData}
          ></MassDisplay>
        )}
      </Stack>
    </Container>
  );
};

import { useAuth0 } from "@auth0/auth0-react";
import { Container, Grid, Stack } from "@mui/material";
import axios from "axios";
import { type ReactElement, useEffect, useState } from "react";
import { z } from "zod";

import { SearchBox } from "../components/general/SearchBox";
import NewHymnButtonModal from "../components/hymns/NewHymnButtonModal";

const HymnSchema = z.object({
  id: z.string(),
  name: z.string(),
  lyrics: z.string(),
});
type Hymn = z.infer<typeof HymnSchema>;

export const HymnsPage = (): ReactElement => {
  const { getAccessTokenSilently } = useAuth0();

  // Set edit mode to false on first render
  // const { setEditMode } = useEditMode();
  // useEffect(() => {
  //   // setEditMode(false);
  // }, []);

  const defaultHymnData: Hymn = {
    id: "",
    name: "",
    lyrics: "",
  };

  const [hymnData, setHymnData] = useState<Hymn>(defaultHymnData);

  const refreshHymnData = (endpoint: string): void => {
    const getHymns = async (): Promise<void> => {
      if (endpoint) {
        const token = await getAccessTokenSilently();
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHymnData(res.data[0]);
      } else {
        setHymnData(defaultHymnData);
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
          <Grid item xs={8}>
            <SearchBox />
          </Grid>
          <Grid item xs={4}>
            <NewHymnButtonModal
              initialHymnName=""
              refreshHymnData={refreshHymnData}
            />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

import { useAuth0 } from "@auth0/auth0-react";
import { Container, Grid, Stack } from "@mui/material";
import axios from "axios";
import { type ReactElement, useState } from "react";

import { SearchBox } from "../components/general/SearchBox";
import { HymnDisplay } from "../components/hymns/HymnDisplay";
import NewHymnButtonModal from "../components/hymns/NewHymnButtonModal";
import { TypeAndBookProvider } from "../context/TypesAndBooksContext";
import { type Hymn } from "../types";

export const HymnsPage = (): ReactElement => {
  const { getAccessTokenSilently } = useAuth0();

  // Set edit mode to false on first render
  // const { setEditMode } = useEditMode();
  // useEffect(() => {
  //   // setEditMode(false);
  // }, []);

  const [hymnData, setHymnData] = useState<Hymn | null>(null);
  const [editMode, setEditMode] = useState(false);

  const refreshHymnData = (endpoint: string): void => {
    const getHymns = async (): Promise<void> => {
      if (endpoint) {
        const token = await getAccessTokenSilently();
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHymnData(res.data[0]);
      } else {
        setHymnData(null);
      }
    };

    getHymns().catch((e) => {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(msg);
    });
  };

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
            <Grid item xs={12} sm={8}>
              <SearchBox
                type="hymn"
                value={hymnData}
                setValue={setHymnData}
                apiUrl="/api/hymns/"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <NewHymnButtonModal
                initialHymnName=""
                refreshHymnData={refreshHymnData}
              />
            </Grid>
          </Grid>

          {hymnData && (
            <HymnDisplay
              hymnData={hymnData}
              refreshHymnData={refreshHymnData}
              editMode={editMode}
            ></HymnDisplay>
          )}
        </Stack>
      </Container>
    </TypeAndBookProvider>
  );
};

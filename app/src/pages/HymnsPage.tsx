import { Container, Grid, Stack } from "@mui/material";
import { type ReactElement, useState } from "react";

import { SearchBox } from "../components/general/SearchBox";
import { HymnDisplay } from "../components/hymns/HymnDisplay";
import { NewHymnButtonModal } from "../components/hymns/NewHymnButtonModal";
import { TypeAndBookProvider } from "../context/TypesAndBooksContext";
import { type Hymn } from "../types";

export const HymnsPage = (): ReactElement => {
  const [hymnData, setHymnData] = useState<Hymn | null>(null);

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
                type="hymn"
                value={hymnData}
                setValue={setHymnData}
                apiUrl="api/hymns/"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <NewHymnButtonModal
                initialHymnName=""
                setHymnData={setHymnData}
              />
            </Grid>
          </Grid>

          {hymnData && (
            <HymnDisplay
              hymnData={hymnData}
              setHymnData={setHymnData}
            ></HymnDisplay>
          )}
        </Stack>
      </Container>
    </TypeAndBookProvider>
  );
};

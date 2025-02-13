import { useAuth0 } from "@auth0/auth0-react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { type ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { SearchBox } from "../components/general/SearchBox";
import { HymnDisplay } from "../components/hymns/HymnDisplay";
import { NewHymnButtonModal } from "../components/hymns/NewHymnButtonModal";
import { TypeAndBookProvider } from "../context/TypesAndBooksContext";
import { type Hymn } from "../types";
import { getErrorMessage } from "../utils";

export const HymnsPage = (): ReactElement => {
  const { getAccessTokenSilently } = useAuth0();

  const hymnId = useParams()["*"];
  const [hymnData, setHymnData] = useState<Hymn | null>(null);

  const getHymnData = async (): Promise<Hymn | null> => {
    if (!hymnId) {
      return null;
    }

    const token = await getAccessTokenSilently();
    const res = await axios.get(`/api/hymns/${hymnId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  useEffect(() => {
    getHymnData()
      .then((hymn) => {
        setHymnData(hymn);
      })
      .catch((e) => {
        const msg = getErrorMessage(e);
        alert(msg);
      });
  }, []);

  return (
    <TypeAndBookProvider>
      <Container
        sx={{ alignItems: "center", maxWidth: { md: "700px", lg: "700px" } }}
      >
        <Stack spacing={2}>
          <SearchBox
            type="hymn"
            value={hymnData}
            setValue={setHymnData}
            apiUrl="/api/hymns/"
            navigateOnSelection={true}
          />
          <NewHymnButtonModal initialHymnName="" setHymnData={setHymnData} />

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

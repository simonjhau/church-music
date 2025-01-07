import { useAuth0 } from "@auth0/auth0-react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { type ReactElement, useEffect, useState } from "react";
import { z } from "zod";

import { type HymnCount, HymnCountSchema } from "../types";
import { getErrorMessage, parseData } from "../utils";
import { PageLoader } from "./PageLoader/PageLoader";

export const HymnRankingsPage = (): ReactElement => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [mostPopular, setMostPopular] = useState<HymnCount[] | null>(null);

  const getMostPopularHymns = async (): Promise<void> => {
    const token = await getAccessTokenSilently();
    const res = await axios.get(`/api/stats/hymns/most-popular`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const hymnCounts = parseData(
      z.array(HymnCountSchema),
      res.data,
      "Problem getting hymn counts",
    );
    setMostPopular(hymnCounts);
    setLoading(false);
  };

  useEffect(() => {
    getMostPopularHymns().catch((e) => {
      const msg = getErrorMessage(e);
      alert(msg);
    });
  }, []);

  return loading ? (
    <PageLoader />
  ) : (
    <Container sx={{ alignItems: "center", maxWidth: { md: "700px" } }}>
      <Typography variant="h6">
        Most popular hymns over the last year
      </Typography>

      <TableContainer component={Paper} sx={{ my: 2 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mostPopular?.map((hymn, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {i + 1}
                </TableCell>
                <TableCell>{hymn.name}</TableCell>
                <TableCell align="center">{hymn.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

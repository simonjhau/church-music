import { useAuth0 } from "@auth0/auth0-react";
import { Container, Divider, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import MassCard, { type MassInterface } from "../components/calendar/MassCard";
import { PageLoader } from "./PageLoader/PageLoader";

export const CalendarPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const [masses, setMasses] = useState<MassInterface[]>([]);

  useEffect(() => {
    const getMasses = async (): Promise<void> => {
      const token = await getAccessTokenSilently();
      const res = await axios.get(`/api/masses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMasses(res.data);
    };

    getMasses()
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : "Unknown error";
        alert(msg);
      });
  }, []);

  const now = Date.now();
  const presentIndex = masses.findIndex(
    (mass) => new Date(mass.dateTime).getTime() - now < 0
  );
  const futureMasses = masses.slice(0, presentIndex);
  const previousMasses = masses.slice(presentIndex);

  return loading ? (
    <PageLoader />
  ) : (
    <Container>
      <Typography variant="h4">Upcoming Masses</Typography>
      {futureMasses.length > 0 ? (
        futureMasses.map((mass) => {
          return <MassCard key={mass.id} mass={mass}></MassCard>;
        })
      ) : (
        <Typography variant="h5">No masses found</Typography>
      )}

      <Divider variant="middle" />

      <Typography sx={{ my: 2 }} variant="h4">
        Previous Masses
      </Typography>
      {previousMasses.length > 0 ? (
        previousMasses.map((mass) => {
          return <MassCard key={mass.id} mass={mass}></MassCard>;
        })
      ) : (
        <Typography variant="h5">No masses found</Typography>
      )}
    </Container>
  );
};

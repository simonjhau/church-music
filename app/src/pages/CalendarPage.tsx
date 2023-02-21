import { useAuth0 } from "@auth0/auth0-react";
import { Divider, Stack, Typography } from "@mui/material";
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
      .catch((e) => {
        const msg = e instanceof Error ? e.message : "Unknown error";
        alert(msg);
      })
      .finally(() => {
        setLoading(false);
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
    <Stack sx={{ textAlign: "center", alignItems: "center", mx: { xs: 1 } }}>
      <Typography variant="h4" sx={{ my: 2 }}>
        Upcoming Masses
      </Typography>
      {futureMasses.length > 0 ? (
        futureMasses.map((mass) => {
          return <MassCard key={mass.id} mass={mass}></MassCard>;
        })
      ) : (
        <Typography variant="h5" sx={{ my: 2 }}>
          No masses found
        </Typography>
      )}

      <Divider variant="middle" sx={{ minWidth: { xs: "90%", sm: "500px" } }} />

      <Typography sx={{ my: 2 }} variant="h4">
        Previous Masses
      </Typography>
      {previousMasses.length > 0 ? (
        previousMasses.map((mass) => {
          return <MassCard key={mass.id} mass={mass}></MassCard>;
        })
      ) : (
        <Typography variant="h5" sx={{ my: 2 }}>
          No masses found
        </Typography>
      )}
    </Stack>
  );
};

import { useAuth0 } from "@auth0/auth0-react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useEffect, useState } from "react";

import MassCard, { type MassInterface } from "../components/masses/MassCard";
import { PageLoader } from "./PageLoader/PageLoader";

export const MassesPage: React.FC = () => {
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
    (mass) => new Date(mass.dateTime).getTime() - now < 0,
  );
  const futureMasses = masses.slice(0, presentIndex);
  const previousMasses = masses.slice(presentIndex);

  return loading ? (
    <PageLoader />
  ) : (
    <Stack
      spacing={3}
      sx={{
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
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

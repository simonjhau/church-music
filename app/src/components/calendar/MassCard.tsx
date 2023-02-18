import { useAuth0 } from "@auth0/auth0-react";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import React from "react";

export interface MassInterface {
  id: string;
  name: string;
  dateTime: string;
  fileId: string;
}

interface Props {
  mass: MassInterface;
}

const dateTimeToString = (dateTimeSql: string): string => {
  const dateTime = new Date(dateTimeSql);
  const dateTimeString = dateTime.toUTCString();
  return dateTimeString.substring(0, dateTimeString.length - 7);
};

const MassCard: React.FC<Props> = ({ mass }) => {
  const { getAccessTokenSilently } = useAuth0();

  const dateTime = dateTimeToString(mass.dateTime);

  const handleMassFileClick: React.MouseEventHandler = (_e) => {
    const getMassFile = async (): Promise<void> => {
      const token = await getAccessTokenSilently();
      const res = await axios.get(`/api/masses/${mass.id}/file`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.open(res.data);
    };

    getMassFile().catch((e) => {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(`Failed to get mass file:\n${msg}`);
    });
  };

  return (
    <Box sx={{ bgcolor: "#dee0f1", p: 2, borderRadius: "0.5em", m: 2 }}>
      <Typography variant="h5">{dateTime}</Typography>
      <Typography variant="h6">{mass.name}</Typography>
      <Button
        variant="contained"
        sx={{ marginTop: 1 }}
        onClick={handleMassFileClick}
      >
        Get Music
      </Button>
    </Box>
  );
};

export default MassCard;

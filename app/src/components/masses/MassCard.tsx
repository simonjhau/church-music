import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React from "react";

import { theme } from "../../theme";
import { downloadFile } from "../../utils";

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

  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return dateFormatter.format(dateTime);
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
      downloadFile(res.data);
    };

    getMassFile().catch((e) => {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(`Failed to get mass file:\n${msg}`);
    });
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "450px",
        backgroundColor: theme.palette.secondary.light,
      }}
    >
      <Stack sx={{ padding: "16px" }}>
        <Typography variant="h5">{dateTime}</Typography>
        <Typography variant="h6">{mass.name}</Typography>
        <div>
          <Button
            variant="contained"
            onClick={handleMassFileClick}
            sx={{ marginTop: 1 }}
          >
            Download Music
          </Button>
        </div>
      </Stack>
    </Card>
  );
};

export default MassCard;

import { useAuth0 } from "@auth0/auth0-react";
import { Button, TextField } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { type Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";

import { type Mass, type MassHymn } from "../../types";
// import DraggableHymnsList from "../DraggableHymnsList/DraggableHymnsList";
// import EditMassBar from "../EditMassBar/EditMassBar";

interface Props {
  massData: Mass;
  refreshMassData: (endpoint?: string) => void;
}

export const MassDisplay = ({
  massData,
  refreshMassData,
}: Props): JSX.Element => {
  // Context
  const { getAccessTokenSilently } = useAuth0();
  // const [hymnTypes, setHymnTypes] = useState<HymnType[]>();

  const [localMassData, setLocalMassData] = useState(massData);

  const [massHymns, setMassHymns] = useState<MassHymn[]>([]);
  const [localMassHymns, setLocalMassHymns] = useState<MassHymn[]>(massHymns);

  useEffect(() => {
    // Get list of hymns for this mass
    const getMassHymns = async (): Promise<void> => {
      if (massData) {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`api/masses/${massData.id}/hymns`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMassHymns(res.data);
      }
      setLocalMassData(massData);
    };

    getMassHymns().catch((err) => {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(msg);
    });
  }, [massData]);

  useEffect(() => {
    setLocalMassHymns(massHymns);
  }, [massHymns]);

  // const editLocalMassData = (key: keyof Mass, data: string): void => {
  //   const updatedMassData = { ...localMassData };
  //   updatedMassData[key] = data;
  //   setLocalMassData(updatedMassData);
  // };

  // const handleMassNameChange = (e: React.ChangeEvent): void => {
  //   const updatedHymnName = (e.target as HTMLTextAreaElement).value;
  //   editLocalMassData("name", updatedHymnName);
  // };

  const handleMassDateTimeChange = (_newValue: Dayjs | null): void => {
    // const updatedDateTime = value;
    // editLocalMassData("dateTime", updatedDateTime);
  };

  // const handleDuplicate = async () => {
  //   // Update the hymn data
  //   const token = await getAccessTokenSilently();
  //   axios
  //     .post(`/masses/${localMassData.id}/copy`, massData, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => {
  //       alert("Mass duplicated successfully");
  //       refreshMassData(res.headers.location);
  //     })
  //     .catch((e) => {
  //       alert(`Error saving mass:\n${e.response.status}: ${e.response.data}`);
  //     });
  // };

  // const handleSaveChanges = async () => {
  //   // Update the hymn data
  //   if (massValid()) {
  //     const massData = {
  //       ...localMassData,
  //       hymns: localMassHymns,
  //     };

  //     const token = await getAccessTokenSilently();
  //     axios
  //       .put(`/masses/${localMassData.id}`, massData, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then((res) => {
  //         alert("Mass saved successfully");
  //         refreshMassData(res.headers.location);
  //       })
  //       .catch((e) => {
  //         alert(`Error saving mass:\n${e.response.status}: ${e.response.data}`);
  //       });
  //   } else {
  //     const errorStr = `Error(s) in mass:\n\n${massErrors.current}`;
  //     alert(errorStr);
  //   }
  // };

  // const handleDelete = async () => {
  //   if (window.confirm(`Are you sure you want to delete`)) {
  //     const token = await getAccessTokenSilently();
  //     await axios
  //       .delete(`/masses/${localMassData.id}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then((res) => {
  //         alert(`Mass deleted successfully`);
  //         refreshMassData("");
  //       })
  //       .catch((e) => {
  //         alert(
  //           `Error deleting mass:\n${e.response.status}: ${e.response.data}`
  //         );
  //       });
  //   }
  // };

  // const handleCancelChanges = () => {
  //   setLocalMassData(massData);
  //   setLocalMassHymns(massHymns);
  // };

  // Mass validation. To do: use zod for this
  // const massErrors = useRef<string>("");
  // const generateErrorString = (hymnIndex: number, error: string) => {
  //   return `Hymn ${hymnIndex + 1} ${
  //     hymnTypes[localMassHymns[hymnIndex].hymnTypeId].name
  //   } - ${error}\n`;
  // };
  // const massValid = () => {
  //   let errors = "";
  //   let massValid = true;

  //   if (!localMassData.name) {
  //     massValid = false;
  //     errors += "Mass name cannot be blank\n";
  //   }

  //   if (!localMassData.dateTime) {
  //     massValid = false;
  //     errors += "Mass date cannot be blank\n";
  //   }

  //   localMassHymns.forEach((hymn, index) => {
  //     if (!hymn.id) {
  //       massValid = false;
  //       errors += generateErrorString(index, "No hymn selected");
  //     } else if (hymn.fileIds.length === 0) {
  //       massValid = false;
  //       errors += generateErrorString(index, "No files selected");
  //     }
  //   });

  //   massErrors.current = errors;

  //   return massValid;
  // };

  const handleOpenMusic = (): void => {
    const openMusic = async (): Promise<void> => {
      const token = await getAccessTokenSilently();
      const res = await axios.get(`api/masses/${localMassData.id}/file`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.open(res.data);
    };

    openMusic().catch((err) => {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`Failed to get mass file:\n${msg}`);
    });
  };

  return (
    <div>
      {localMassData && (
        <div>
          {/* <EditMassBar
        handleDuplicate={handleDuplicate}
        handleSaveChanges={handleSaveChanges}
        handleDelete={handleDelete}
        handleCancelChanges={handleCancelChanges}
      /> */}
          <InputBase
            fullWidth
            multiline
            minRows={1}
            inputProps={{
              style: {
                fontSize: 36,
                lineHeight: 2,
              },
            }}
            value={localMassData.name}
            // onChange={handleMassNameChange}
          ></InputBase>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Date & Time"
              value={
                localMassData.dateTime
                  ? new Date(localMassData.dateTime).toISOString().slice(0, -1)
                  : Date.now().toString().slice(0, -1)
              }
              onChange={handleMassDateTimeChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          {localMassData.fileId && (
            <div className="d-grid gap-2">
              <Button variant="contained" fullWidth onClick={handleOpenMusic}>
                Open Music
              </Button>
            </div>
          )}
          <br />

          {/* <DraggableHymnsList
            hymnsData={localMassHymns}
            setHymnsData={setLocalMassHymns}
          /> */}
        </div>
      )}
    </div>
  );
};

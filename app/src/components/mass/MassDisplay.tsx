import { useAuth0 } from "@auth0/auth0-react";
import { Button, Stack } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import dayjs, { type Dayjs } from "dayjs";
import React, { useEffect, useRef, useState } from "react";

import { useHymnTypes } from "../../context/TypesAndBooksContext";
import { type Mass, type MassHymn, MassSchema } from "../../types";
import { downloadFile, parseData } from "../../utils";
import DraggableHymnsList from "./DraggableHymnsList";
import EditMassBar from "./EditMassBar";

interface Props {
  massData: Mass;
  setMassData: (mass: Mass) => void;
  refreshMassData: (endpoint?: string) => void;
}

export const MassDisplay = ({
  massData,
  setMassData,
  refreshMassData,
}: Props): JSX.Element => {
  // Context
  const { getAccessTokenSilently } = useAuth0();
  const hymnTypes = useHymnTypes();

  const [localMassData, setLocalMassData] = useState(massData);

  const [massHymns, setMassHymns] = useState<MassHymn[]>([]);
  const [localMassHymns, setLocalMassHymns] = useState<MassHymn[]>(massHymns);

  useEffect(() => {
    // Get list of hymns for this mass
    const getMassHymns = async (): Promise<void> => {
      if (massData) {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`/api/masses/${massData.id}/hymns`, {
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

  const editLocalMassData = (key: keyof Mass, data: string): void => {
    const updatedMassData = { ...localMassData };
    updatedMassData[key] = data;
    setLocalMassData(updatedMassData);
  };

  const handleMassNameChange = (e: React.ChangeEvent): void => {
    const updatedHymnName = (e.target as HTMLTextAreaElement).value;
    editLocalMassData("name", updatedHymnName);
  };

  const handleMassDateTimeChange = (newValue: Dayjs | null): void => {
    const updatedDateTime = newValue?.toISOString() ?? "";
    editLocalMassData("dateTime", updatedDateTime);
  };

  const handleDuplicate = (): void => {
    const duplicateMass = async (): Promise<void> => {
      const token = await getAccessTokenSilently();
      const res = await axios.post(
        `/api/masses/${localMassData.id}/duplicate`,
        massData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const duplicatedMass = parseData(
        MassSchema,
        res.data,
        "Problem saving mass",
      );
      alert("Mass duplicated successfully");
      setMassData(duplicatedMass);
    };

    duplicateMass().catch((err) => {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`Error duplicating mass:${msg}`);
    });
  };

  const handleSaveChanges = (): void => {
    const saveMass = async (): Promise<void> => {
      if (massValid()) {
        const massData = {
          ...localMassData,
          hymns: localMassHymns,
        };

        const token = await getAccessTokenSilently();
        const res = await axios.put(
          `/api/masses/${localMassData.id}`,
          massData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const updatedMass = parseData(
          MassSchema,
          res.data,
          "Problem saving mass",
        );

        alert("Mass saved successfully");
        setMassData(updatedMass);
      }
    };

    saveMass().catch((err) => {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`Error saving mass:${msg}`);
    });
  };

  const handleDelete = (): void => {
    const deleteMass = async (): Promise<void> => {
      if (window.confirm(`Are you sure you want to delete`)) {
        const token = await getAccessTokenSilently();
        await axios.delete(`/api/masses/${localMassData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert(`Mass deleted successfully`);
        refreshMassData("");
      }
    };

    deleteMass().catch((err) => {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`Error deleting mass:${msg}`);
    });
  };

  const handleCancelChanges = (): void => {
    setLocalMassData(massData);
    setLocalMassHymns(massHymns);
  };

  // Mass validation. To do: use zod for this
  const massErrors = useRef<string>("");
  const generateErrorString = (hymnIndex: number, error: string): string => {
    return `Hymn ${hymnIndex + 1} ${
      hymnTypes[localMassHymns[hymnIndex].hymnTypeId].name
    } - ${error}\n`;
  };
  const massValid = (): boolean => {
    let errors = "";
    let massValid = true;

    if (!localMassData.name) {
      massValid = false;
      errors += "Mass name cannot be blank\n";
    }

    if (!localMassData.dateTime) {
      massValid = false;
      errors += "Mass date cannot be blank\n";
    }

    localMassHymns.forEach((hymn, index) => {
      if (!hymn.id) {
        massValid = false;
        errors += generateErrorString(index, "No hymn selected");
      }
    });

    massErrors.current = errors;

    return massValid;
  };

  const handleOpenMusic = (): void => {
    const openMusic = async (): Promise<void> => {
      const token = await getAccessTokenSilently();
      const res = await axios.get(`/api/masses/${localMassData.id}/file`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      downloadFile(res.data);
    };

    openMusic().catch((err) => {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`Failed to get mass file:\n${msg}`);
    });
  };

  return (
    <div>
      {localMassData && (
        <Stack spacing={1}>
          <EditMassBar
            handleDuplicate={handleDuplicate}
            handleSaveChanges={handleSaveChanges}
            handleDelete={handleDelete}
            handleCancelChanges={handleCancelChanges}
          />
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
            onChange={handleMassNameChange}
          ></InputBase>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                label="Date & time"
                value={
                  localMassData.dateTime
                    ? dayjs(localMassData.dateTime)
                    : dayjs()
                }
                onChange={handleMassDateTimeChange}
              />
            </DemoContainer>
          </LocalizationProvider>

          {localMassData.fileId && (
            <div className="d-grid gap-2">
              <Button
                size="small"
                variant="contained"
                fullWidth
                onClick={handleOpenMusic}
              >
                Open Music
              </Button>
            </div>
          )}
          <br />

          <DraggableHymnsList
            hymnsData={localMassHymns}
            setHymnsData={setLocalMassHymns}
          />
        </Stack>
      )}
    </div>
  );
};

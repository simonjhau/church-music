import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";

import {
  type Book,
  BookSchema,
  type File,
  type FileType,
  FileTypeSchema,
} from "../../types";
import { parseData } from "../../utils";
// import AddEditFileButtonModal, {
//   ModalType,
// } from "../AddEditFileButtonModal/AddEditFileButtonModal";

interface HymnFileLinkProps {
  hymnId: string;
  file: File;
  refreshHymnData: (endpoint: string) => void;
  editMode: boolean;
}

export const HymnFileLink: React.FC<HymnFileLinkProps> = ({
  hymnId,
  file,
  refreshHymnData,
  editMode,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [fileTypes, setFileTypes] = useState<FileType[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const getBooksAndFileTypes = async (): Promise<void> => {
      const token = await getAccessTokenSilently();

      const booksRes = (
        await axios.get("api/books", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).data;
      const validBooks = parseData(
        z.array(BookSchema),
        booksRes,
        "Problem getting books"
      );
      setBooks(validBooks);

      const fileTypesRes = (
        await axios.get("api/fileTypes", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).data;
      const validFileTypes = parseData(
        z.array(FileTypeSchema),
        fileTypesRes,
        "Problem getting file types"
      );
      setFileTypes(validFileTypes);
    };

    getBooksAndFileTypes().catch((e) => {
      const msg = e instanceof Error ? e.message : "Unknown error";
      alert(msg);
    });
  }, []);

  const handleFileClick: React.MouseEventHandler = (e) => {
    const getFile = async (): Promise<void> => {
      const token = await getAccessTokenSilently();
      const res = await axios.get(`api/hymns/${hymnId}/files/${file.id}/file`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.open(res.data);
    };

    getFile().catch((e) => {
      alert(`Failed to get music file ${file.id}`);
    });
  };

  // const handleDeleteFile = async (fileId: string) => {
  //   if (window.confirm(`Are you sure you want to delete`)) {
  //     const token = await getAccessTokenSilently();
  //     axios
  //       .delete(`/hymns/${hymnId}/files/${fileId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then((res) => {
  //         refreshHymnData(`/hymns/${hymnId}`);
  //       })
  //       .catch((e) => {
  //         alert(`Error deleting file:\n${e}`);
  //       });
  //   }
  // };

  return (
    <Grid container>
      <Grid item xs={4}>
        <Button onClick={handleFileClick}>
          {fileTypes.find((fileType) => fileType.id === file.fileTypeId)?.name}
          {" - "}
          {books.find((book) => book.id === file.bookId)?.bookCode}
          {file.hymnNum ? ` - ${file.hymnNum}` : ""}
          {file.comment ? ` - ${file.comment}` : ""}
        </Button>
      </Grid>
    </Grid>

    //     {editMode && (
    //       <Col>
    //         <div className="editButtons">
    //           <AddEditFileButtonModal
    //             modalType={ModalType.Edit}
    //             hymnId={hymnId}
    //             fileId={file.id}
    //             refreshHymnData={refreshHymnData}
    //           />

    //           <Button
    //             id={`${file.id}-del`}
    //             variant="danger"
    //             size="sm"
    //             onClick={async (e) => {
    //               await handleDeleteFile(file.id);
    //             }}
    //           >
    //             X
    //           </Button>
    //         </div>
    //       </Col>
    //     )}
    //   </Row>
    // </div>
  );
};

export default HymnFileLink;

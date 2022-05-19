import React, { useContext, useState } from 'react';

export interface EditModeType {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
}

export const EditModeContext = React.createContext<EditModeType>({
  editMode: false,
  setEditMode: () => {},
});
export const useEditMode = () => useContext(EditModeContext);

// Context provider
export const EditModeProvider: React.FC = ({ children }) => {
  const [editMode, setEditMode] = useState<boolean>(useEditMode().editMode);

  return (
    <EditModeContext.Provider value={{ editMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};

export default EditModeProvider;

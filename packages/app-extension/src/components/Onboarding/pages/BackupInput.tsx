import { useEffect, useState } from "react";
import { PrimaryButton, TextInput } from "@coral-xyz/react-common";
import { userClientAtom } from "@coral-xyz/recoil";
import { Box } from "@mui/material";
import { useRecoilValue } from "recoil";

import { Header, SubtextParagraph } from "../../common";

export const BackupInput = ({ onNext }: { onNext: () => void }) => {
  const [backup, setBackup] = useState("");
  const [error, setError] = useState<string | null>(null);
  const userClient = useRecoilValue(userClientAtom);

  useEffect(() => {
    // Clear error on form input changes
    setError(null);
  }, [backup, setError]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await userClient.importBackup({ backup: backup });
    if (result.error) {
      setError(result.error.message);
    } else {
      onNext();
    }
  };

  return (
    <form
      noValidate
      onSubmit={onSave}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ margin: "24px 0" }}>
        <Box sx={{ margin: "0 24px" }}>
          <Header text="Recover with Yona Backup" />
          <SubtextParagraph style={{ marginBottom: "32px" }}>
            Enter your backup. It will be used to restore your Yona wallet.
          </SubtextParagraph>
        </Box>
        <Box sx={{ margin: "0 16px" }}>
          <TextInput
            placeholder="Enter Backup"
            value={backup}
            setValue={(e) => {
              setBackup(e.target.value.trim());
            }}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await onSave(e);
              }
            }}
            rows={4}
            error={error ? true : false}
            errorMessage={error || ""}
          />
        </Box>
      </Box>
      <Box
        sx={{
          marginLeft: "16px",
          marginRight: "16px",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <PrimaryButton
          type="submit"
          label="Import"
          disabled={backup.length === 0}
        />
      </Box>
    </form>
  );
};

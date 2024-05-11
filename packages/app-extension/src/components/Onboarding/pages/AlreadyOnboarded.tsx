import { EmptyState } from "@coral-xyz/react-common";
import { YStack } from "@coral-xyz/tamagui";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const AlreadyOnboarded = () => {
  return (
    <YStack padding="$4" flex={1} justifyContent="center" alignItems="center">
      <EmptyState
        icon={(props: any) => <ErrorOutlineIcon {...props} />}
        title="Already setup"
        subtitle="Your Yona Wallet has already been setup. If you want to set it up again, reset it first."
        buttonText="Close"
        onClick={window.close}
      />
    </YStack>
  );
};

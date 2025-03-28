import { Alert, AlertDescription } from "@/components/ui/alert";

interface AlertMessagesProps {
  error: string | null;
  success: string | null;
}

export const AlertMessages = ({ error, success }: AlertMessagesProps) => {
  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </>
  );
};
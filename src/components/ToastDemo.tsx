import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export function ToastDemo() {
  const { toast } = useToast();

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          toast({
            variant: "success",
            title: "Success!",
          });
        }}
      >
        Success Toast
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete post. Please try again.",
          });
        }}
      >
        Error Toast
      </Button>
    </div>
  );
}
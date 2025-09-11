"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

function EndCallButton({ interviewId }: { interviewId: Id<"interviews"> }) {
  const call = useCall();
  const router = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const [isEnding, setIsEnding] = useState(false);

  const updateInterviewStatus = useMutation(api.interviews.updateInterviewStatus);

  if (!call) return null;

  const isMeetingOwner = localParticipant?.userId === call.state.createdBy?.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    if (isEnding) return;
    setIsEnding(true);
    try {
      await call.endCall();

      await updateInterviewStatus({
        id: interviewId,
        status: "completed",
      });

      toast.success("Meeting ended for everyone");
      router.push("/");
    } catch (error) {
      console.error("Failed to end meeting:", error);
      toast.error("Failed to end meeting");
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <Button variant={"destructive"} onClick={endCall} disabled={isEnding}>
      {isEnding ? "Ending..." : "End Meeting"}
    </Button>
  );
}
export default EndCallButton;

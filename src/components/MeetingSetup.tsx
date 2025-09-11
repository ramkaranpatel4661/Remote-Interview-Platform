"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { VideoPreview, useCall, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2Icon, MicIcon, MicOffIcon, VideoIcon, VideoOffIcon } from "lucide-react";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [isLoading, setIsLoading] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);
  const call = useCall();

  useEffect(() => {
    if (hasAudio) {
      call?.microphone.enable();
    } else {
      call?.microphone.disable();
    }
  }, [hasAudio, call?.microphone]);

  useEffect(() => {
    if (hasVideo) {
      call?.camera.enable();
    } else {
      call?.camera.disable();
    }
  }, [hasVideo, call?.camera]);

  const handleJoin = async () => {
    if (!client || !user) return;

    setIsLoading(true);
    try {
      if (!call) throw new Error("useCall must be used within StreamCall component");
      await call.join();
      onSetupComplete();
    } catch (error) {
      console.error("Failed to join meeting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!client || !call) return null;

  return (
    <div className="h-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VideoIcon className="h-5 w-5" />
            Meeting Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video rounded-md bg-muted overflow-hidden">
            <VideoPreview className="size-full" />
          </div>
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input value={user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : ""} disabled />
          </div>

          <div className="flex gap-4">
            <Button
              variant={hasAudio ? "secondary" : "destructive"}
              onClick={() => setHasAudio(!hasAudio)}
              className="flex-1"
            >
              {hasAudio ? <MicIcon className="h-4 w-4 mr-2" /> : <MicOffIcon className="h-4 w-4 mr-2" />}
              {hasAudio ? "Mic On" : "Mic Off"}
            </Button>
            <Button
              variant={hasVideo ? "secondary" : "destructive"}
              onClick={() => setHasVideo(!hasVideo)}
              className="flex-1"
            >
              {hasVideo ? <VideoIcon className="h-4 w-4 mr-2" /> : <VideoOffIcon className="h-4 w-4 mr-2" />}
              {hasVideo ? "Cam On" : "Cam Off"}
            </Button>
          </div>

          <Button onClick={handleJoin} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join Meeting"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default MeetingSetup;

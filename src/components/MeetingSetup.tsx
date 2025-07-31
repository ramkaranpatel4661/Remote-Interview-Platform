"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2Icon, VideoIcon, MicIcon, MicOffIcon, VideoOffIcon } from "lucide-react";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [isLoading, setIsLoading] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);

  useEffect(() => {
    // Always call hooks, but conditionally execute logic
    if (client && user) {
      // Setup logic here
    }
  }, [client, user]);

  useEffect(() => {
    // Always call hooks, but conditionally execute logic
    if (client) {
      // Additional setup logic here
    }
  }, [client]);

  const handleJoin = async () => {
    if (!client || !user) return;
    
    setIsLoading(true);
    try {
      // Join meeting logic
      onSetupComplete();
    } catch (error) {
      console.error("Failed to join meeting:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input 
              value={user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : ''} 
              disabled 
            />
          </div>

          <div className="flex gap-4">
            <Button
              variant={hasAudio ? "default" : "outline"}
              onClick={() => setHasAudio(!hasAudio)}
              className="flex-1"
            >
              {hasAudio ? <MicIcon className="h-4 w-4" /> : <MicOffIcon className="h-4 w-4" />}
              {hasAudio ? "Mute" : "Unmute"}
            </Button>
            <Button
              variant={hasVideo ? "default" : "outline"}
              onClick={() => setHasVideo(!hasVideo)}
              className="flex-1"
            >
              {hasVideo ? <VideoIcon className="h-4 w-4" /> : <VideoOffIcon className="h-4 w-4" />}
              {hasVideo ? "Stop Video" : "Start Video"}
            </Button>
          </div>

          <Button 
            onClick={handleJoin} 
            disabled={isLoading}
            className="w-full"
          >
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

"use client";

import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { 
  LayoutListIcon, 
  LoaderIcon, 
  UsersIcon, 
  MessageSquareIcon,
  SettingsIcon,
  MaximizeIcon,
  MinimizeIcon,
  ShareIcon,
  CircleIcon,
  SquareIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";
import CodeEditor from "./CodeEditor";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { useUser } from "@clerk/nextjs";

function EnhancedMeetingRoom() {
  const router = useRouter();
  const { user } = useUser();
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState("");
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    );
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Here you would integrate with Stream's recording API
  };

  const shareScreen = () => {
    // Here you would integrate with Stream's screen sharing
  };

  return (
    <div className="h-[calc(100vh-4rem-1px)]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={25} maxSize={100} className="relative">
          {/* VIDEO LAYOUT */}
          <div className="absolute inset-0">
            {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

            {/* PARTICIPANTS LIST OVERLAY */}
            {showParticipants && (
              <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CallParticipantsList onClose={() => setShowParticipants(false)} />
              </div>
            )}

            {/* NOTES OVERLAY */}
            {showNotes && (
              <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <Card className="h-full rounded-none border-l">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Interview Notes</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNotes(false)}
                      >
                        ×
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Take notes during the interview..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="h-[calc(100vh-12rem)] resize-none"
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* VIDEO CONTROLS */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap justify-center px-4">
                <CallControls onLeave={() => router.push("/")} />

                <div className="flex items-center gap-2">
                  {/* LAYOUT CONTROLS */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="size-10">
                        <LayoutListIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setLayout("grid")}>
                        Grid View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLayout("speaker")}>
                        Speaker View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* PARTICIPANTS */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10"
                    onClick={() => setShowParticipants(!showParticipants)}
                  >
                    <UsersIcon className="size-4" />
                  </Button>

                  {/* NOTES */}
                  <Button
                    variant={showNotes ? "default" : "outline"}
                    size="icon"
                    className="size-10"
                    onClick={() => setShowNotes(!showNotes)}
                  >
                    <MessageSquareIcon className="size-4" />
                  </Button>

                  {/* SCREEN SHARE */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10"
                    onClick={shareScreen}
                  >
                    <ShareIcon className="size-4" />
                  </Button>

                  {/* RECORDING */}
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="icon"
                    className="size-10"
                    onClick={toggleRecording}
                  >
                    {isRecording ? (
                      <SquareIcon className="size-4" />
                    ) : (
                      <CircleIcon className="size-4" />
                    )}
                  </Button>

                  {/* FULLSCREEN */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <MinimizeIcon className="size-4" />
                    ) : (
                      <MaximizeIcon className="size-4" />
                    )}
                  </Button>

                  {/* SETTINGS */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="size-10">
                        <SettingsIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Audio Settings</DropdownMenuItem>
                      <DropdownMenuItem>Video Settings</DropdownMenuItem>
                      <DropdownMenuItem>Network Settings</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <EndCallButton />
                </div>
              </div>
            </div>
          </div>

          {/* RECORDING INDICATOR */}
          {isRecording && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <CircleIcon className="size-3" />
              Recording
            </div>
          )}

          {/* INTERVIEW INFO */}
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-2 rounded-lg">
            <div className="text-sm">
              <div className="font-medium">Interview Session</div>
              <div className="text-muted-foreground">
                {user?.firstName} {user?.lastName}
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={65} minSize={25}>
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default EnhancedMeetingRoom; 
"use client";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon, CalendarIcon, ClockIcon, UsersIcon, FileTextIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InterviewFormData {
  title: string;
  description: string;
  date: Date;
  time: string;
  candidateId: string;
  interviewerIds: string[];
  duration: string;
}

const initialFormData: InterviewFormData = {
  title: "",
  description: "",
  date: new Date(),
  time: "09:00",
  candidateId: "",
  interviewerIds: [],
  duration: "60",
};

function InterviewScheduler() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];
  const createInterview = useMutation(api.interviews.createInterview);
  const syncUser = useMutation(api.users.syncUser);

  const candidates = users?.filter((u) => u.role === "candidate" || !u.role);
  const interviewers = users?.filter((u) => u.role === "interviewer");

  // Debug logging
  console.log("InterviewScheduler - Users from database:", users);
  console.log("InterviewScheduler - Candidates filtered:", candidates);
  console.log("InterviewScheduler - Interviewers filtered:", interviewers);

  const [formData, setFormData] = useState<InterviewFormData>(initialFormData);

  // Sync current user to database
  useEffect(() => {
    if (user?.id && user?.primaryEmailAddress?.emailAddress) {
      const userName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.primaryEmailAddress.emailAddress;
      
      syncUser({
        name: userName,
        email: user.primaryEmailAddress.emailAddress,
        clerkId: user.id,
        image: user.imageUrl || undefined
      }).catch(console.error);
    }
  }, [user, syncUser]);

  // Automatically include current user as interviewer if they are an interviewer
  useEffect(() => {
    if (user?.id && interviewers.length > 0) {
      const currentUserInDb = interviewers.find(interviewer => interviewer.clerkId === user.id);
      
      if (currentUserInDb && !formData.interviewerIds.includes(user.id)) {
        setFormData(prev => ({
          ...prev,
          interviewerIds: [...prev.interviewerIds, user.id]
        }));
      }
    }
  }, [user?.id, interviewers, formData.interviewerIds]);

  const scheduleMeeting = async () => {
    if (!client || !user) return;
    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error("Please select both candidate and at least one interviewer");
      return;
    }
    if (!formData.title.trim()) {
      toast.error("Please enter an interview title");
      return;
    }

    setIsCreating(true);

    try {
      const { title, description, date, time, candidateId, interviewerIds, duration } = formData;
      const [hours, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      await createInterview({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        candidateId,
        interviewerIds,
      });

      setOpen(false);
      toast.success("Interview scheduled successfully!");

      setFormData(initialFormData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule interview. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const addInterviewer = (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setFormData(prev => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, interviewerId],
      }));
    }
  };

  const removeInterviewer = (interviewerId: string) => {
    if (interviewerId === user?.id) return;
    setFormData(prev => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter(id => id !== interviewerId),
    }));
  };

  const selectedInterviewers = interviewers.filter((i) =>
    formData.interviewerIds.includes(i.clerkId)
  );

  const availableInterviewers = interviewers.filter(
    (i) => !formData.interviewerIds.includes(i.clerkId)
  );

  const selectedCandidate = candidates.find(c => c.clerkId === formData.candidateId);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage technical interviews
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              Schedule Interview
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px] h-[calc(100vh-200px)] overflow-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Interview</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* INTERVIEW DETAILS */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileTextIcon className="h-5 w-5" />
                    Interview Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder="e.g., Frontend Developer - Technical Round"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Describe the interview focus, topics, or special requirements..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* CANDIDATE SELECTION */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5" />
                    Select Candidate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {candidates && candidates.length > 0 ? (
                    <Select
                      value={formData.candidateId}
                      onValueChange={(candidateId) => setFormData(prev => ({ ...prev, candidateId }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a candidate" />
                      </SelectTrigger>
                      <SelectContent>
                        {candidates.map((candidate) => (
                          <SelectItem key={candidate.clerkId} value={candidate.clerkId}>
                            <UserInfo user={candidate} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-4 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
                      No candidates available. Users need to sign up and be assigned candidate roles.
                    </div>
                  )}
                  
                  {selectedCandidate && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium">Selected Candidate:</p>
                      <UserInfo user={selectedCandidate} />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* INTERVIEWERS */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5" />
                    Interviewers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedInterviewers.map((interviewer) => (
                      <div
                        key={interviewer.clerkId}
                        className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-md text-sm"
                      >
                        <UserInfo user={interviewer} />
                        {interviewer.clerkId !== user?.id && (
                          <button
                            onClick={() => removeInterviewer(interviewer.clerkId)}
                            className="hover:text-destructive transition-colors"
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {availableInterviewers.length > 0 && (
                    <Select onValueChange={addInterviewer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add interviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableInterviewers.map((interviewer) => (
                          <SelectItem key={interviewer.clerkId} value={interviewer.clerkId}>
                            <UserInfo user={interviewer} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </CardContent>
              </Card>

              {/* SCHEDULE */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Time</label>
                        <Select
                          value={formData.time}
                          onValueChange={(time) => setFormData(prev => ({ ...prev, time }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Duration</label>
                        <Select
                          value={formData.duration}
                          onValueChange={(duration) => setFormData(prev => ({ ...prev, duration }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="90">1.5 hours</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={scheduleMeeting} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Interview"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* UPCOMING INTERVIEWS */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          {interviews.filter(i => i.status === "upcoming").length > 0 ? (
            <div className="space-y-3">
              {interviews
                .filter(i => i.status === "upcoming")
                .slice(0, 5)
                .map((interview) => (
                  <div key={interview._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{interview.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(interview.startTime).toLocaleDateString()} at {new Date(interview.startTime).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming interviews scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default InterviewScheduler; 
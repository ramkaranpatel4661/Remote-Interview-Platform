"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  BookOpenIcon,
  VideoIcon
} from "lucide-react";
import { format } from "date-fns";
import { getMeetingStatus } from "@/lib/utils";
import MeetingCard from "./MeetingCard";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

function CandidateDashboard() {
  const interviews = useQuery(api.interviews.getMyInterviews);
  const { user } = useUser();

  if (!interviews) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const upcomingInterviews = interviews.filter(interview => {
    const status = getMeetingStatus({
      startTime: interview.startTime,
      status: interview.status,
    });
    return status === "upcoming";
  });

  const completedInterviews = interviews.filter(interview => {
    const status = getMeetingStatus({
      startTime: interview.startTime,
      status: interview.status,
    });
    return status === "completed";
  });

  const passedInterviews = completedInterviews.filter(i => i.status === "succeeded");
  const failedInterviews = completedInterviews.filter(i => i.status === "failed");
  const successRate = completedInterviews.length > 0 
    ? Math.round((passedInterviews.length / completedInterviews.length) * 100) 
    : 0;

  const nextInterview = upcomingInterviews[0];

  return (
    <div className="space-y-6">
      {/* WELCOME SECTION */}
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white/20">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="text-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h1>
            <p className="text-blue-100">Ready for your next interview challenge?</p>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
            <VideoIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviews.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingInterviews.length} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {passedInterviews.length} passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedInterviews.length}</div>
            <p className="text-xs text-muted-foreground">
              Interviews completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Interview</CardTitle>
            <ClockIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextInterview ? format(new Date(nextInterview.startTime), "MMM dd") : "None"}
            </div>
            <p className="text-xs text-muted-foreground">
              {nextInterview ? format(new Date(nextInterview.startTime), "hh:mm a") : "No upcoming"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* NEXT INTERVIEW CARD */}
      {nextInterview && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircleIcon className="h-5 w-5 text-orange-500" />
              Your Next Interview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{nextInterview.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(nextInterview.startTime), "EEEE, MMMM d 'at' h:mm a")}
                </p>
                {nextInterview.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {nextInterview.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <BookOpenIcon className="h-4 w-4 mr-2" />
                  Prepare
                </Button>
                <Button size="sm">
                  <VideoIcon className="h-4 w-4 mr-2" />
                  Join
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* INTERVIEWS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Interviews</h2>
          <div className="flex gap-2">
            <Badge variant="outline">{upcomingInterviews.length} Upcoming</Badge>
            <Badge variant="default">{passedInterviews.length} Passed</Badge>
            <Badge variant="destructive">{failedInterviews.length} Failed</Badge>
          </div>
        </div>

        {interviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <MeetingCard key={interview._id} interview={interview} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <VideoIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No interviews scheduled</h3>
              <p className="text-muted-foreground text-center mb-4">
                You don't have any interviews scheduled yet. Check back later or contact your recruiter.
              </p>
              <Button variant="outline">
                <BookOpenIcon className="h-4 w-4 mr-2" />
                Practice Coding
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BookOpenIcon className="h-6 w-6" />
              <span>Practice Coding</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <VideoIcon className="h-6 w-6" />
              <span>View Recordings</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <CalendarIcon className="h-6 w-6" />
              <span>Interview Tips</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CandidateDashboard; 
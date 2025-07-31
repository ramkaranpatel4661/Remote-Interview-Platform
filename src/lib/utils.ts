import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to determine meeting status based on start time and duration
export function getMeetingStatus(interview: {
  startTime: number;
  duration?: number;
}): "upcoming" | "live" | "completed" {
  const now = Date.now();
  const startTime = interview.startTime;
  const duration = interview.duration || 60 * 60 * 1000; // Default 1 hour if not specified
  const endTime = startTime + duration;

  if (now < startTime) {
    return "upcoming";
  } else if (now >= startTime && now <= endTime) {
    return "live";
  } else {
    return "completed";
  }
}

// Function to calculate recording duration
export function calculateRecordingDuration(startTime: number, endTime: number): string {
  const durationMs = endTime - startTime;
  const minutes = Math.floor(durationMs / (1000 * 60));
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Function to get interviewer information
export function getInterviewerInfo(interview: any) {
  // This is a placeholder - you'll need to implement based on your data structure
  return {
    name: interview.interviewerName || "Unknown Interviewer",
    email: interview.interviewerEmail || "",
    image: interview.interviewerImage || ""
  };
}

// Function to get candidate information
export function getCandidateInfo(interview: any) {
  // This is a placeholder - you'll need to implement based on your data structure
  return {
    name: interview.candidateName || "Unknown Candidate",
    email: interview.candidateEmail || "",
    image: interview.candidateImage || ""
  };
}

// Function to group interviews
export function groupInterviews(interviews: any[]) {
  const now = Date.now();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const groups = {
    today: [] as any[],
    tomorrow: [] as any[],
    upcoming: [] as any[],
    past: [] as any[]
  };

  interviews.forEach(interview => {
    const interviewDate = new Date(interview.startTime);
    const status = getMeetingStatus(interview);

    if (status === "completed") {
      groups.past.push(interview);
    } else if (interviewDate.toDateString() === today.toDateString()) {
      groups.today.push(interview);
    } else if (interviewDate.toDateString() === tomorrow.toDateString()) {
      groups.tomorrow.push(interview);
    } else {
      groups.upcoming.push(interview);
    }
  });

  return groups;
}

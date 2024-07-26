import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import WorkoutTracker with client-side rendering
const WorkoutTracker = dynamic(() => import('../workout/organisms/WorkoutTracker'), { ssr: false });

export default function TrackWorkoutPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-30 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Track workouts here!</h2>
          <WorkoutTracker />
        </main>
      </div>
   
      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        This is a footer
      </footer>
    </div>
  );
}
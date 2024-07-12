export interface Exercise {
    tracks_weight: boolean;
    tracks_reps: boolean;
    tracks_duration: boolean;
    tracks_distance: boolean;
    id: number;
    name: string;
    description: string | null;
    is_template: boolean;
  }
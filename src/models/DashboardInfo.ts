import { IGoal } from './Goal';
import { IWorkout } from './Workout';

export interface IDashboardResponse {
  workoutStats: { totalCalories: number; totalWorkouts: number }[];
  recentWorkouts: IWorkout[];
  recentGoals: IGoal[];
}

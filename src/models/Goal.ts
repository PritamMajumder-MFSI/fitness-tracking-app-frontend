import { IWorkout } from './Workout';

export interface IGoal {
  _id: string;
  userId: string;
  goalType: GoalType;
  targetValue: number;
  isActive: boolean;
  from: Date;
  to: Date;
  totalCalories: number;
  totalWorkouts: number;
  createdAt: Date;
  workouts: IWorkoutWithType[];
  updatedAt: Date;
}

export type GoalType = 'workoutPerWeek' | 'specificCalorieGoal';
export interface ITypeInfo {
  workoutTypeName: string;
  _id: string;
  isActive: boolean;
}

export interface IWorkoutWithType extends IWorkout {
  typeInfo: ITypeInfo;
}

export interface ITypeInfo {
  workoutTypeName: string;
  _id: string;
  isActive: boolean;
}

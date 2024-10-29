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
  updatedAt: Date;
}
export type GoalType = 'workoutPerWeek' | 'specificCalorieGoal';

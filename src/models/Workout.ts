export interface IWorkout {
  type: string;
  _id: string;
  duration: number;
  calories: number;
  userId: string;
  date: Date;
  isActive: boolean;
  createdAt: Date;
}

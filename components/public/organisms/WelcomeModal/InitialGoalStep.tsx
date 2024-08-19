import React from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '../../atoms/Label';
import Button from '../../atoms/Button';
import styles from '@/styles/organisms.module.css'
type InitialGoalStepProps = {
  onNext: (goal: string) => void;
  initialData: string;
};

export const InitialGoalStep: React.FC<InitialGoalStepProps> = ({ onNext, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ goal: string }>({
    defaultValues: { goal: initialData },
  });

  const onSubmit = (data: { goal: string }) => {
    onNext(data.goal);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <Label htmlFor="goal"><b>Where do you want to be in 6 months?<br></br></b><br></br>It's important to set goals. Let's start by getting a good idea of how you'd like to improve.<br></br><br></br></Label>
        <textarea
          id="goal"
          {...register("goal", { required: "Goal is required" })}
          className={styles.textarea}
          rows={3}
          placeholder="I want to maintain my total while prioritizing shoulder health."
        ></textarea>
        {errors.goal && (
          <span className="text-red-500">{errors.goal.message}</span>
        )}
      </div>
      <Button type="submit" variant="primary" size="large" className="w-full mt-4">
        Improve Goal
      </Button>
    </form>
  );
};
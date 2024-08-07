import React from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '../../atoms/Label';
import Button from '../../atoms/Button';

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
        <Label htmlFor="goal">Your Goal</Label>
        <textarea
          id="goal"
          {...register("goal", { required: "Goal is required" })}
          className="w-full p-2 border rounded bg-gray-800"
          rows={3}
          placeholder="I want to do a muscle up as quickly as possible"
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
import React from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '../../atoms/Label';
import Button from '../../atoms/Button';

type TrainingHistoryStepProps = {
  onNext: (history: string) => void;
  initialData: string;
};

export const TrainingHistoryStep: React.FC<TrainingHistoryStepProps> = ({ onNext, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ trainingHistory: string }>({
    defaultValues: { trainingHistory: initialData },
  });

  const onSubmit = (data: { trainingHistory: string }) => {
    onNext(data.trainingHistory);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <Label htmlFor="trainingHistory">Your Training History</Label>
        <textarea
          id="trainingHistory"
          {...register("trainingHistory", { required: "Training history is required" })}
          className="w-full p-2 border rounded bg-gray-800"
          rows={5}
          placeholder="Tell us about your training experience..."
        ></textarea>
        {errors.trainingHistory && (
          <span className="text-red-500">{errors.trainingHistory.message}</span>
        )}
      </div>
      <Button type="submit" variant="primary" size="large" className="w-full mt-4">
        Next
      </Button>
    </form>
  );
};
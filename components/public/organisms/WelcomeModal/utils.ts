export const callImproveGoalAPI = async (initialGoal: string, trainingHistory: string): Promise<any> => {
  try {
    const response = await fetch('http://localhost:8000/api/improve_goal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initial_goal: initialGoal,
        training_history: trainingHistory,
        current_goals: [initialGoal],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to improve goal');
    }

    const data = await response.json();
    console.log('API Response:', data);  // Log the entire response
    return data;  // Return the entire response object
  } catch (error) {
    console.error('Error improving goal:', error);
    throw error;
  }
};
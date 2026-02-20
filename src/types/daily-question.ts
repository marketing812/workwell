
export interface DailyQuestion {
  id: string; // This will map from 'codigo'
  text: string; // This will map from 'pregunta'
}

export interface DailyQuestionApiResponse {
    questions: DailyQuestion[];
    debugUrl?: string;
    error?: string;
    details?: any;
}

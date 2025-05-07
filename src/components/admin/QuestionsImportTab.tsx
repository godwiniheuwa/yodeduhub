
import React from 'react';
import { QuizImport } from '@/components/admin/QuizImport';
import { ImportedQuestionsList } from '@/components/admin/ImportedQuestionsList';

interface QuestionsImportTabProps {
  examName: string;
  importedQuestions: any[];
  isSaving: boolean;
  onImportSuccess: (importedData: any[]) => void;
  onSaveImportedQuestions: () => Promise<void>;
}

export function QuestionsImportTab({
  examName,
  importedQuestions,
  isSaving,
  onImportSuccess,
  onSaveImportedQuestions
}: QuestionsImportTabProps) {
  return (
    <div className="space-y-4">
      <QuizImport onImportSuccess={onImportSuccess} />
      
      <ImportedQuestionsList
        importedQuestions={importedQuestions}
        examName={examName}
        onSave={onSaveImportedQuestions}
        isSaving={isSaving}
      />
    </div>
  );
}

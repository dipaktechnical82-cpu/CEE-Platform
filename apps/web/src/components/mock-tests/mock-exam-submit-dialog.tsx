'use client';

import React, { useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Loader2,
  Send,
  ShieldAlert,
  X,
} from 'lucide-react';
import styles from './mock-tests.module.css';

interface MockExamSubmitDialogProps {
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  markedCount: number;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function MockExamSubmitDialog({
  totalQuestions,
  answeredCount,
  unansweredCount,
  markedCount,
  isSubmitting,
  onCancel,
  onConfirm,
}: MockExamSubmitDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap & Escape listener
  useEffect(() => {
    confirmButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, onCancel]);

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-dialog-title"
    >
      <div ref={dialogRef} className={styles.modalContent}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-inherit pb-4">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert size={20} aria-hidden="true" />
            <h2 id="submit-dialog-title" className="text-lg font-bold">
              Submit Examination
            </h2>
          </div>

          {!isSubmitting && (
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
              aria-label="Close dialog and return to test"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Warning if unanswered questions exist */}
        {unansweredCount > 0 && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong>Warning:</strong> You still have{' '}
                <strong className="text-amber-300 font-bold underline">
                  {unansweredCount} unattempted questions
                </strong>
                . Once submitted, you cannot resume or alter your responses.
              </div>
            </div>
          </div>
        )}

        {/* Summary Telemetry Table */}
        <div className="mt-4 rounded-xl border border-inherit bg-white/[0.03] p-4 text-xs font-mono">
          <div className="flex justify-between py-1.5 border-b border-inherit">
            <span className="text-slate-400">Total Questions:</span>
            <span className="font-bold text-inherit">{totalQuestions}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-inherit">
            <span className="text-emerald-400">Answered Questions:</span>
            <span className="font-bold text-emerald-400">{answeredCount}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-inherit">
            <span className="text-rose-400">Unanswered Questions:</span>
            <span className="font-bold text-rose-400">{unansweredCount}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-purple-400">Marked for Review:</span>
            <span className="font-bold text-purple-400">{markedCount}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400 leading-relaxed">
          Are you sure you wish to submit your answers? Your score, accuracy breakdown, and Mistake
          DNA analysis will be calculated immediately.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-inherit">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="rounded-full border border-inherit px-5 py-2.5 text-xs font-semibold hover:border-slate-400 transition-colors"
          >
            Return to Examination
          </button>

          <button
            ref={confirmButtonRef}
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Computing Score...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>Submit Final Answers</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

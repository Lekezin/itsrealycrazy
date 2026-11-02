import { useState } from 'react';
import {
  ArrowRightIcon,
  ArrowCounterClockwiseIcon,
  CheckIcon,
  SparkleIcon,
} from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import type { Group } from '../data/groups';

export function Quiz({ group }: { group: Group }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const done = step === group.quiz.length;
  const scores = [0, 0, 0];
  answers.forEach((answer) => scores[answer]++);
  const matchIndex = scores.indexOf(Math.max(...scores));
  const match = group.matches[matchIndex];
  const question = group.quiz[step];

  const next = () => {
    if (selected === null) return;
    setAnswers((old) => [...old, question.options[selected].affinity]);
    setSelected(null);
    setStep((old) => old + 1);
  };

  return (
    <section className="quiz-card glass" aria-labelledby="quiz-title">
      <div className="card-eyebrow">
        <span>
          <SparkleIcon size={16} /> MATCH YOUR VIBE
        </span>
        <span>{done ? 'SEU RESULTADO' : `${step + 1} / 3`}</span>
      </div>
      <div
        className="quiz-progress"
        role="progressbar"
        aria-label="Progresso do quiz"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={done ? 3 : step}
      >
        {[0, 1, 2].map((part) => (
          <i key={part} className={part <= step ? 'filled' : ''} />
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="quiz-result"
          >
            <span className="result-tag">{match.trait}</span>
            <h3 id="quiz-title">Sua vibe é {match.member}.</h3>
            <p>{match.description}</p>
            <span className="quiz-disclaimer">
              Um encontro divertido de afinidades, sem avaliação psicológica.
            </span>
            <button
              className="text-button"
              onClick={() => {
                setStep(0);
                setAnswers([]);
                setSelected(null);
              }}
            >
              <ArrowCounterClockwiseIcon size={16} /> Fazer de novo
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            <h3 id="quiz-title">
              {step === 0 ? 'Qual integrante tem a sua vibe?' : 'Vamos conhecer você.'}
            </h3>
            <p className="quiz-question">{question.question}</p>
            <div className="quiz-options" role="group" aria-label={question.question}>
              {question.options.map((option, index) => (
                <button
                  key={option.label}
                  className={`quiz-option ${selected === index ? 'selected' : ''}`}
                  aria-pressed={selected === index}
                  onClick={() => setSelected(index)}
                >
                  <span className="option-letter">
                    {selected === index ? <CheckIcon size={13} /> : String.fromCharCode(65 + index)}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
            <div className="quiz-feedback" role="status">
              {selected !== null
                ? question.options[selected].feedback
                : 'Três perguntas. Um novo jeito de se conectar.'}
            </div>
            <button
              className="primary-button quiz-next"
              disabled={selected === null}
              onClick={next}
            >
              {step === 2 ? 'Descobrir meu match' : 'Próxima pergunta'}
              <ArrowRightIcon size={17} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

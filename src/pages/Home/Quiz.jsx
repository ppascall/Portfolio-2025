import { useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { announce } from '../../lib/announce.js';
import { pad2 } from '../../lib/projects.js';

const CHOICES = ['web', 'both', 'game'];

export default function Quiz() {
  const { t } = useI18n();
  const questions = t('quiz.questions');
  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [finished, setFinished] = useState(false);
  const nextRef = useRef(null);

  const question = questions[index];
  const isRight = picked === question.answer;

  const choose = (choice) => {
    if (picked) return;
    setPicked(choice);
    const correct = choice === question.answer;
    if (correct) setScore((s) => s + 1);
    announce(`${correct ? t('quiz.right') : t('quiz.wrong')} ${question.why}`);
    setTimeout(() => nextRef.current?.focus(), 0);
  };

  const next = () => {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setPicked(null);
    setFinished(false);
  };

  return (
    <section className="quiz container" aria-labelledby="quiz-heading">
      <div className="quiz__intro" data-reveal>
        <h2 id="quiz-heading" className="quiz__title hl">
          {t('quiz.title')} <em>{t('quiz.titleEm')}</em>
        </h2>
        <p>{t('quiz.intro')}</p>
        <p className="quiz__teaser">{t('quiz.teaser')}</p>
      </div>

      <div className="quiz__card" data-reveal>
        <div className="quiz__top label-caps">
          <span>{t('quiz.progress', { current: pad2(finished ? total : index + 1), total: pad2(total) })}</span>
          <span className="accent">{t('quiz.score', { score: pad2(score) })}</span>
        </div>

        {finished ? (
          <div className="quiz__result">
            <p className="quiz__statement serif">{t('quiz.result', { score, total })}</p>
            <p className="quiz__note">{t('quiz.resultNote')}</p>
            <button type="button" className="btn label-caps" onClick={restart}>{t('quiz.restart')}</button>
          </div>
        ) : (
          <>
            <p className="quiz__statement serif" key={index}>{question.text}</p>
            <div className="quiz__choices" role="group" aria-label={t('quiz.group')}>
              {CHOICES.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  className={`quiz__choice label-caps${picked ? (choice === question.answer ? ' is-right' : choice === picked ? ' is-wrong' : '') : ''}`}
                  aria-pressed={picked === choice}
                  disabled={Boolean(picked)}
                  onClick={() => choose(choice)}
                >
                  {t(`quiz.${choice}`)}
                </button>
              ))}
            </div>
            <div className="quiz__status" role="status">
              {picked ? (
                <>
                  <span className={isRight ? 'accent' : 'quiz__wrong'}>{isRight ? t('quiz.right') : t('quiz.wrong')}</span>{' '}
                  {question.why}
                  <button ref={nextRef} type="button" className="quiz__next label-caps" onClick={next}>
                    {index + 1 >= total ? t('quiz.finish') : t('quiz.next')} →
                  </button>
                </>
              ) : (
                t('quiz.idle')
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

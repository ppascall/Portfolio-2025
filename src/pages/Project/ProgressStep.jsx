import { useState } from 'react';
import PopImage from '../../components/PopImage/PopImage.jsx';
import { announce } from '../../lib/announce.js';
import { useI18n } from '../../i18n/I18nContext.jsx';
import { pad2 } from '../../lib/projects.js';

const IMAGE_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const VIDEO_EXT = ['mp4', 'webm', 'mov'];
const extensionOf = (url) => url.split('?')[0].split('.').pop().toLowerCase();

export default function ProgressStep({ index, step }) {
  const { t } = useI18n();
  const items = step.progressContent || [];
  const [current, setCurrent] = useState(0);

  const go = (next) => {
    const wrapped = (next + items.length) % items.length;
    setCurrent(wrapped);
    announce(`${wrapped + 1} / ${items.length}`);
  };

  return (
    <article className="step" data-reveal>
      <div className="step__text">
        <span className="label-caps accent">{pad2(index + 1)}</span>
        <h3 className="step__title serif">{step.progressName}</h3>
        {step.progressBodyText && <p>{step.progressBodyText}</p>}
      </div>

      {items.length > 0 && (
        <div className="step__media" role="region" aria-roledescription="carousel" aria-label={step.progressName}>
          <ul className="step__track" style={{ transform: `translateX(-${current * 100}%)` }}>
            {items.map((item, i) => {
              const ext = item.url ? extensionOf(item.url) : '';
              return (
                <li key={i} aria-hidden={i !== current} role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${items.length}`}>
                  {IMAGE_EXT.includes(ext) ? (
                    <PopImage src={item.url} alt={step.progressName} tabIndex={i === current ? 0 : -1} />
                  ) : VIDEO_EXT.includes(ext) ? (
                    <video controls tabIndex={i === current ? 0 : -1} aria-label={step.progressName}>
                      <source src={item.url} type={`video/${ext}`} />
                    </video>
                  ) : item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn label-caps">{step.progressName} ↗</a>
                  ) : null}
                  {item.duration && <span className="step__duration label-caps">{item.duration}</span>}
                </li>
              );
            })}
          </ul>
          {items.length > 1 && (
            <div className="step__controls label-caps">
              <button type="button" aria-label={t('project.prev')} onClick={() => go(current - 1)}>←</button>
              <button type="button" aria-label={t('project.next')} onClick={() => go(current + 1)}>→</button>
              <span>{pad2(current + 1)} / {pad2(items.length)}</span>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

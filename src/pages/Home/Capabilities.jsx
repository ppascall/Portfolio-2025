import { useI18n } from '../../i18n/I18nContext.jsx';
import { pad2 } from '../../lib/projects.js';

const ICONS = ['⌘', '✳', '⏻', '◆', '⟡', '⌗', '✦', '◇', '⌁'];

export default function Capabilities() {
  const { t } = useI18n();
  const items = t('capabilities.items');

  return (
    <section className="capabilities container" aria-labelledby="capabilities-heading">
      <h2 id="capabilities-heading" className="capabilities__label label-caps" data-reveal>
        <span className="dot" aria-hidden="true" /> {t('capabilities.label')}
      </h2>
      <ul className="capabilities__grid" data-reveal-stagger>
        {items.map((item, i) => (
          <li key={item.title} data-reveal-item>
            <span className="label-caps accent">{pad2(i + 1)}</span>
            <h3 className="serif">{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
      <div className="icon-marquee" aria-hidden="true">
        {[0, 1].map((run) => (
          <span key={run} className="icon-marquee__run">
            {[...ICONS, ...ICONS].map((icon, i) => <span key={i}>{icon}</span>)}
          </span>
        ))}
      </div>
    </section>
  );
}

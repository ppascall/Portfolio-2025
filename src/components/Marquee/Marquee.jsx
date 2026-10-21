export default function Marquee({ items, sepItems }) {
  const run = (hidden) => (
    <span className="marquee__run" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span className="marquee__item" key={`${item}-${i}`}>
          {item}
          <span className="marquee__sep" aria-hidden="true">{sepItems ?? '✳'}</span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="marquee">
      <span className="sr-only">{items.join(', ')}</span>
      {run(true)}
      {run(true)}
    </div>
  );
}

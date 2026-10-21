import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function ImageLightbox({ src, alt, onClose }) {
  const [shown, setShown] = useState(false);
  const closeRef = useRef(null);
  const closing = useRef(false);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setShown(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const t = setTimeout(() => {
      setShown(true);
      closeRef.current?.focus();
    }, 10);
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
    };
  }, [close]);

  return createPortal(
    <div
      className="image-popover-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged image view"
      style={{ opacity: shown ? 1 : 0 }}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="image-popover-container">
        <img src={src} alt={alt || 'Enlarged view'} />
        <button ref={closeRef} type="button" className="image-popover-close" aria-label="Close image view" onClick={close} />
      </div>
    </div>,
    document.body
  );
}

// An image that opens in a full-screen popover when clicked.
export default function PopImage({ src, alt, tabIndex = 0, ...rest }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  const handleClose = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <>
      <img
        ref={triggerRef}
        src={src}
        alt={alt}
        role="button"
        tabIndex={tabIndex}
        aria-label={`View larger: ${alt || 'image'}`}
        style={{ cursor: 'pointer' }}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        {...rest}
      />
      {open && <ImageLightbox src={src} alt={alt} onClose={handleClose} />}
    </>
  );
}

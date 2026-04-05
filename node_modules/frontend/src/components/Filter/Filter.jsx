import { useState } from 'react'
import styles from './Filter.module.css'
import { COLORS } from 'src/enum/colors'

export default function FilterDrawer({ open, onClose, selectedColors, onToggleColor, onApply }) {
  const [colorOpen, setColorOpen] = useState(true)

  if (!open) return null

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <span className={styles.title}>Filter</span>
          <button className={styles.closeBtn} onClick={onClose}>
            x
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.accordion}>
          <button className={styles.accordionHeader} onClick={() => setColorOpen(o => !o)}>
            <span className={styles.accordionTitle}>Boja</span>
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              className={colorOpen ? styles.chevronUp : styles.chevronDown}
            >
              ⌃
            </svg>
          </button>
          <div className={styles.divider} />

          {colorOpen && (
            <div className={styles.colorList}>
              {COLORS.map(c => (
                <button
                  key={c.value}
                  className={`${styles.colorRow} ${selectedColors.includes(c.value) ? styles.colorRowActive : ''}`}
                  onClick={() => onToggleColor(c.value)}
                >
                  <span
                    className={styles.colorDot}
                    style={{
                      background: c.value,
                      border: c.value === 'white' ? '1px solid #ccc' : 'none'
                    }}
                  />
                  <span className={styles.colorLabel}>{c.label}</span>
                  {selectedColors.includes(c.value) && (
                    <img src={c.img} width={20} height={20} style={{ borderRadius: '50%' }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.applyBtn} onClick={() => { onApply(); onClose() }}>
            Primijeni filter
          </button>
          {selectedColors.length > 0 && (
            <button className={styles.clearBtn} onClick={() => { onToggleColor(null); onClose() }}>
              Ukloni filtere
            </button>
          )}
        </div>
      </div>
    </>
  )
}
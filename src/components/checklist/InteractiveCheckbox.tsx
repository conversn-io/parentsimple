'use client'

import { useEffect, useRef } from 'react'

export default function InteractiveCheckbox() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const checkboxes = document.querySelectorAll('.checklist-checkbox')
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('click', function (this: HTMLElement) {
        const icon = this.querySelector('svg')
        if (icon) {
          if (icon.style.opacity === '1') {
            icon.style.opacity = '0'
            this.style.backgroundColor = 'transparent'
          } else {
            icon.style.opacity = '1'
            this.style.backgroundColor = '#F5F5F0'
          }
        }
      })
    })
  }, [])

  return null
}


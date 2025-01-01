import { animate, AnimatePresence, motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'
import { Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components'
import { Button } from '@shared/react-aria'
import { remToPx } from '@shared/utils'

import './bottom-sheet.css'

const MotionModal = motion.create(Modal)
const MotionModalOverlay = motion.create(ModalOverlay)
const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1]
}

type Props = {
  title?: string
  children: React.ReactNode
  isOpen: boolean
  setOpen: (open: boolean) => void
}

export const BottomSheet = ({ children, isOpen, setOpen, title }: Props) => {
  const SHEET_MARGIN = remToPx(4)
  const h = window.innerHeight - SHEET_MARGIN
  const y = useMotionValue(h)
  const bgOpacity = useTransform(y, [0, h], [0.4, 0])
  const bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionModalOverlay
          isOpen
          onOpenChange={setOpen}
          className="bottom-sheet-modal-overlay"
          style={{ backgroundColor: bg }}
        >
          <MotionModal
            className="bottom-sheet-modal"
            initial={{ y: h }}
            animate={{ y: 0 }}
            exit={{ y: h }}
            transition={staticTransition}
            style={{
              y,
              top: SHEET_MARGIN,
              paddingBottom: window.screen.height
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
                setOpen(false)
              } else {
                animate(y, 0, { min: 0, max: 0 })
              }
            }}
          >
            <div className="handle" />
            <div className='close-btn-wrapper'>
              <Button
                variant='transparent'
                onPress={() => setOpen(false)}
              >Close</Button>
            </div>
            <Dialog className="dialog">
              {title && <Heading slot="title">
                {title}
              </Heading>}
              {children}
            </Dialog>
          </MotionModal>
        </MotionModalOverlay>
      )}
    </AnimatePresence>
  )
}

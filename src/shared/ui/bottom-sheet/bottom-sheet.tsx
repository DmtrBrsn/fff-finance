import { remToPx } from '@shared/lib/utils'
import { Button } from '@shared/ui/react-aria'
import { animate, AnimatePresence, motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'
import { Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components'

import './bottom-sheet.css'

const MotionModal = motion.create(Modal)
const MotionModalOverlay = motion.create(ModalOverlay)

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
            style={{
              y,
              top: SHEET_MARGIN,
              paddingBottom: window.screen.height
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.y > window.innerHeight * 0.6 || velocity.y > 1200) {
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
            <Dialog aria-label={title ?? 'bottom sheet'} className="bottom-sheet-dialog">
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

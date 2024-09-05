import { useEffect } from "react"

export function useKeyDown(handleKeyPress: (e: KeyboardEvent)=>void) {
	
	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress)
		
		return () => {
			window.removeEventListener('keydown', handleKeyPress)
		}
	}, [])
}

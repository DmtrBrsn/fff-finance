import { exportOperations } from "@entities/operations";
import { Button } from "@shared/react-aria";
import { Spinner } from "@shared/spinner";
import { DownloadIcon } from "@shared/svg";
import { saveFile } from "@shared/utils";
import { useState } from "react"
import { toast } from "@app/toaster"

export const ExportOperations = () => {
  const [inProgress, setInProgress] = useState(false)
  
  const saveOps = async () => {
    setInProgress(true)
    try {
      const {blob, name} = await exportOperations()
      saveFile(blob, name)
    }
    catch(err) {
      toast.error(`${err}`)
      console.log(err)
    }
    setInProgress(false)
  }

  return (
    <Button onPress={saveOps}>{inProgress ? <Spinner/> : <DownloadIcon/>} Export Operations</Button>
  )
}


